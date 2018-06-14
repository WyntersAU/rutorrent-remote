import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import axios from 'axios'
import {ContextMenu, MenuItem, SubMenu, ContextMenuTrigger} from "react-contextmenu";
import {showMenu} from 'react-contextmenu/modules/actions'

var utilities = require("utilities.js");
var columns = [
    {
        Header: "Name", accessor: "name", width: 250, Cell: row => (
            <div title={row.value}>
                {row.value}
            </div>
        )
    },
    {Header: "Status", accessor: "status", width: 80},
    {Header: "Size", accessor: "size", width: 68},
    {Header: "Done", accessor: "done", width: 49},
    {Header: "Downloaded", accessor: "downloaded", width: 82},
    {Header: "Uploaded", accessor: "uploaded", width: 68},
    {Header: "Ratio", accessor: "ratio", width: 40},
    {Header: "UL", accessor: "ul", width: 75},
    {Header: "DL", accessor: "dl", width: 85},
    {Header: "Added", accessor: "added", width: 69, show: false}
];

class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            noDataText: 'Fetching information from ruTorrent',

            activeTheme: localStorage.getItem('theme') || 'Light',  //Defaults theme to light if no theme is found in localStorage
            Dark: {
                contextmenu: 'react-contextmenu--dark',
                contextmenuitem: 'react-contextmenu--dark-item',
                contextmenusubmenu: 'react-contextmenu-submenu--dark',
                table: "-highlight ReactTable--dark"
            },
            Light: {
                contextmenu: 'react-contextmenu',
                contextmenuitem: 'react-contextmenu-item',
                contextmenusubmenu: 'react-contextmenu-submenu',
                table: '-highlight'
            }
        };

        if (!localStorage.getItem('url') || !localStorage.getItem('username') || !localStorage.getItem('password')) {
            this.state.noDataText = 'You need to enter your ruTorrent credentials in the Options Menu';
        }

        this.getTorrents();     //Beginning of our loop. There is a setTimeout inside getTorrents which will keep it going.
    }

    async getTorrents() {
        var params = new URLSearchParams()
        params.append('mode', 'list');
        params.append('cmd', 'd.custom=addtime');
        var url = localStorage.getItem('url').replace(/(https?:\/\/)/, '$1' + localStorage.getItem('username') + ':' + localStorage.getItem('password') + '@');
        var torrents = null;

        try {
            torrents = (await axios.post(url + '/plugins/httprpc/action.php', params)).data;
        }
        catch (e) {
            console.log(e);
            if (e.message == 'Network Error') {
                this.setState({noDataText: 'Invalid URL'});
            }
            else if (e.response.status == 401) {
                this.setState({noDataText: 'Invalid username or password'})
            }
            else if (e.response.status != 200 || e.response == undefined) {
                this.setState({noDataText: 'An unknown error occurred '});
            }

            return;
        }
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
        this.setState({data: data});
        setTimeout(this.getTorrents, 1000);
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

    handleResized() {
        var state = JSON.parse(localStorage.getItem('table'));

        if (!state) {
            state = [];
            columns.forEach((column) => {
                state.push({id: column.accessor, value: column.width});
            });
        }
        return state;
    }
    handleOnResizeChange(state) {
        localStorage.setItem('table', JSON.stringify(state));
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <ReactTable
                    noDataText={this.state.noDataText}
                    data={this.state.data}
                    columns={columns}
                    pageSize={this.state.data.length || 3}  //Checks states' data for a length and if it doesn't find one it will default to 3.
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
                    className={this.state[this.state.activeTheme]['table']}
                    getTdProps={(state, rowInfo, column, instance) => { //Manually overriding the tableData properties and adding an event 'onContextMenu' to show the contextmenu on event.
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
                    }} //Manually overriding the tableData properties and adding an event 'onContextMenu' to show the contextmenu on event.
                />

                <ContextMenu className={this.state[this.state.activeTheme]['contextmenu']} id='start-stop-delete'>
                    <MenuItem className={this.state[this.state.activeTheme]['contextmenuitem']} onClick={this.handleContextMenuClick_Start} data={this.state}>Start</MenuItem>
                    <MenuItem className={this.state[this.state.activeTheme]['contextmenuitem']} onClick={this.handleContextMenuClick_Stop} data={this.state}>Stop</MenuItem>
                    <MenuItem divider/>
                    <SubMenu className={this.state[this.state.activeTheme]['contextmenusubmenu']} title={'Remove'} onClick={this.handleContextMenuClick_Remove} data={this.state}>
                        <MenuItem className={this.state[this.state.activeTheme]['contextmenuitem']}
                                  onClick={this.handleContextMenuClick_RemoveFiles} data={this.state}>Remove and Delete Files</MenuItem>
                    </SubMenu>
                </ContextMenu>
            </div>
        );
    }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
export default Popup