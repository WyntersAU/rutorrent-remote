import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import axios from 'axios'
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import { showMenu } from 'react-contextmenu/modules/actions'

var utilities = require("utilities.js");
var columns = [
    { Header: "Name", accessor: "name", width: 250, Cell: row => (
            <div title={row.value}>
                {row.value}
            </div>
        )},
    { Header: "Status", accessor: "status", width: 80 },
    { Header: "Size", accessor: "size", width: 68 },
    { Header: "Done", accessor: "done", width: 49 },
    { Header: "Downloaded", accessor: "downloaded", width: 79 },
    { Header: "Uploaded", accessor: "uploaded", width: 68 },
    { Header: "Ratio", accessor: "ratio", width: 40 },
    { Header: "UL", accessor: "ul", width: 75 },
    { Header: "DL", accessor: "dl", width: 85 },
    { Header: "Added", accessor: "added", width: 69, show: false }
];

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };

        this.getTorrents = this.getTorrents.bind(this);
        this.handleOnResizeChange = this.handleOnResizeChange.bind(this);
        this.getTorrents();
    }

    async getTorrents() {
        var params = new URLSearchParams()
        params.append('mode', 'list');
        params.append('cmd', 'd.custom=addtime');
        var url = (await browser.storage.local.get('url')).url.replace(/(https?:\/\/)/, '$1' + (await browser.storage.local.get('username')).username + ':' + (await browser.storage.local.get('password')).password + '@');
        var torrents = (await axios.post(url + '/plugins/httprpc/action.php', params)).data;
        var data = [];

        for (var hash in torrents.t) {
            var info = torrents.t[hash];
            var torrent = {
                name: info[4],
                status: "Unknown",
                size: utilities.ToBytes(info[5]),
                done: +(info[8] / info[5] * 100).toFixed(2),
                downloaded: utilities.ToBytes(+info[8]),
                uploaded: utilities.ToBytes(+info[9]),
                ratio: +(info[10] / 1000).toFixed(3),
                ul: utilities.ToSpeed(+info[11]),
                dl: utilities.ToSpeed(+info[12]),
                added: info[34]
            };
            if (torrent.done > 0) {
                torrent.status = 'Downloading';
            }
            if (torrent.done == 100) {
                torrent.status = 'Seeding';
            }
            if (torrent.done == 0) {
                torrent.status = 'Started';
            }
            torrent.done = torrent.done + '%';
            data.push(torrent);
        }
        this.setState({ data: data });
        setTimeout(this.getTorrents, 1000);
    }

    handleResized() {
        var state = JSON.parse(localStorage.getItem('table'));

        if (!state) {
            state = [];
            columns.forEach((column) => {
                state.push({ id: column.accessor, value: column.width });
            });
        }
        return state;
    }
    handleOnResizeChange(state) {
        localStorage.setItem('table', JSON.stringify(state));
        this.forceUpdate();
    }

    handleContextMenuClick_Start(e, state) {
        var row = state.row.row;
    }
    handleContextMenuClick_Stop(e, state) {
        var row = state.row.row;
    }
    handleContextMenuClick_Remove(e, state) {
        var row = state.row.row;
    }
    handleContextMenuClick_RemoveFiles(e, state) {
        var row = state.row.row;
    }

    render() {
        return (
            <div>
                <ReactTable
                    noDataText="Fetching information from ruTorrent"
                    data={this.state.data}
                    columns={columns}
                    pageSize={this.state.data.length || 3}
                    showPagination={false}
                    defaultSorted={[{
                        id: "added",
                        desc: true
                    }]}
                    onResizedChange={this.handleOnResizeChange}
                    resized={this.handleResized()}
                    style={{
                        height: 'auto',
                    }}
                    className="-highlight"
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onContextMenu: e => {
                                e.preventDefault();
                                showMenu({
                                    position: {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY},
                                    id: 'start-stop-delete'
                                });
                                this.setState({
                                    row: rowInfo
                                });
                            }
                        }
                    }}/>
                <ContextMenu id='start-stop-delete'>
                    <MenuItem onClick={this.handleContextMenuClick_Start} data={this.state}>Start</MenuItem>
                    <MenuItem onClick={this.handleContextMenuClick_Stop} data={this.state}>Stop</MenuItem>
                    <MenuItem divider />
                    <SubMenu title={'Remove'} onClick={this.handleContextMenuClick_Remove} data={this.state}>
                        <MenuItem onClick={this.handleContextMenuClick_RemoveFiles} data={this.state}>Remove and Delete Files</MenuItem>
                    </SubMenu>
                </ContextMenu>
            </div>
        );
    }
}

ReactDOM.render(<Popup />, document.getElementById('app'));
export default Popup