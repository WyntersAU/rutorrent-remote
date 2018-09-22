import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import ReactContextMenu from 'react-contextmenu'
import axios from 'axios'
import qs from 'qs'
import {ruTorrentRemote, ruTorrentClient} from './clients/ruTorrentClient'
import { ThrowClassNotification } from './utilities'

var utilities = require('./utilities')

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noDataText: 'Fetching information from ruTorrent',
            cid: 0,
            data: []
        };

        if (localStorage.getItem('url') == null || localStorage.getItem('username') == null || localStorage.getItem('password') == null) {
            this.state.noDataText = 'Please set the url, username and password in the Options Page';
            return;
        }

        this.ruTorrentClient = new ruTorrentClient({
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
            url: localStorage.getItem('url')
        });

        setInterval(async () => {
            this.setState({ data: await this.ruTorrentClient.GetTorrents() });
        }, 1000);
    }

    render() {
        return (
            <div>
                <ReactTable
                    noDataText={this.state.noDataText}
                    data={this.state.data}
                    columns={[
                        {Header: "Name", accessor: "name", width: 220, Cell: row => (<div title={row.value}>{row.value}</div>)},
                        {Header: "Status", accessor: "status", width: 80},
                        {Header: "Size", accessor: "size", width: 71},
                        {Header: "Done", accessor: "done", width: 49},
                        {Header: "Downloaded", accessor: "downloaded", width: 84},
                        {Header: "Uploaded", accessor: "uploaded", width: 68},
                        {Header: "Ratio", accessor: "ratio", width: 42},
                        {Header: "UL", accessor: "ul", width: 75},
                        {Header: "DL", accessor: "dl", width: 75},
                        {Header: "Added", accessor: "added", width: 69, show: false}
                    ]}
                    pageSize={this.state.data.length || 3}
                    showPagination={false}
                    resizable={false}
                    style={{ height: 'auto' }}
                    className={'-highlight'}
                    defaultSorted={[{ id: "added", desc: true }]}
                />
            </div>
        );
    }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
export default Popup