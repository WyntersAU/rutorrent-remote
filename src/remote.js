import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import axios from 'axios'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { showMenu } from 'react-contextmenu/modules/actions'


var utilities = require("utilities.js");
var columns = [
    { Header: "Name", accessor: "name", width: 320 },
    { Header: "Status", accessor: "status", width: 57 },
    { Header: "Size", accessor: "size", width: 68 },
    { Header: "Done", accessor: "done", width: 46 },
    { Header: "Downloaded", accessor: "downloaded", width: 79 },
    { Header: "Uploaded", accessor: "uploaded", width: 68 },
    { Header: "Ratio", accessor: "ratio", width: 40 },
    { Header: "UL", accessor: "ul", width: 70 },
    { Header: "DL", accessor: "dl", width: 70 },
    { Header: "Added", accessor: "added", width: 69, show: false },
    { Header: "Hash", accessor: "hash", width: 0, show: false }
  ];

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      noDataText: 'Fetching information from ruTorrent',
      contextMenuData: [],
      cid: 0
    };

    this.getTorrents = this.getTorrents.bind(this);
    this.handleOnResizeChange = this.handleOnResizeChange.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.resetColumnSizing = this.resetColumnSizing.bind(this);

    setInterval(this.getTorrents, 1000);
  }

  resetColumnSizing() {
    localStorage.setItem('table', JSON.stringify(columns));
    this.forceUpdate();
  }


  async handleStartClick(e, data) {
    var params = new URLSearchParams();
    params.append('mode', 'stop');
    params.append('hash', this.state.contextMenuData.hash);
    var url = (await browser.storage.local.get('url')).url.replace(/(https?:\/\/)/, '$1' + (await browser.storage.local.get('username')).username + ':' + (await browser.storage.local.get('password')).password + '@');
    var responmse = (await axios.post(url + '/plugins/httprpc/action.php', params));
  }


  async getTorrents() {
  	var params = new URLSearchParams() 
  	params.append('mode', 'list'); 
    params.append('cmd', 'd.custom=seedingtime');
    var url = (await browser.storage.local.get('url')).url.replace(/(https?:\/\/)/, '$1' + (await browser.storage.local.get('username')).username + ':' + (await browser.storage.local.get('password')).password + '@');

  	var torrents = (await axios.post(url + '/plugins/httprpc/action.php', params)).data;
    if (torrents.cid != this.state.cid) {
      console.log('ye mate she be ready to update');
      this.setState({
        cid: torrents.cid
      });
    }
	  var data = [];

  	for (var hash in torrents.t) {
  		var info = torrents.t[hash];

  		var name = info[4];
  		var size = info[5];
  		var downloaded = info[8];
  		var uploaded = info[9];
  		var ratio = info[10];
  		var ul = info[11];
  		var dl = info[12];
      var added = info[34];

  		var torrent = {
  			name: name,
  			status: "Seeding", 
  			size: utilities.ToBytes(size),
  			//size_b: size,
  			done: +(downloaded / size * 100).toFixed(2) + "%",
  			downloaded: utilities.ToBytes(+downloaded),
  			//downloaded_b: downloaded,
  			uploaded: utilities.ToBytes(+uploaded),
  			//uploaded_b: uploaded,
  			ratio: +(ratio / 1000).toFixed(3),
  			ul: utilities.ToSpeed(+ul),
  			dl: utilities.ToSpeed(+dl),
        added: added,
        hash: hash
  		};
  		data.push(torrent);
    }
  	this.setState({
  		data: data
  	});

  }

  handleResized(e, data) {
  	var state = JSON.parse(localStorage.getItem('table'));
  	
  	if (!state || data.reset) {
  		state = [];
  		columns.forEach((column) => {
  			state.push({
  				id: column.accessor,
  				value: column.width
  			});
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
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onContextMenu: (e) => {
                  e.preventDefault();

                  this.setState({
                    'contextMenuData': rowInfo.original
                  });

                  showMenu({
                    position: {x:e.pageX, y:e.pageY},
                    target: e.target,
                    id: 'start-stop-delete',
                  });
                }
              }
            }}
            data={this.state.data}
            columns={columns}
            pageSize={this.state.data.length || 3}
            showPagination={false}
            defaultSorted={[{
                id: "added",
                desc: true
              }
            ]}
            onResizedChange={this.handleOnResizeChange}
            resized={this.handleResized(null, {reset: false})}
            style={{
                height: 'auto',
            }}
            className="-highlight"
        />

        <ContextMenu id='start-stop-delete'>
            <MenuItem onClick={this.handleStartClick}> 
              Start
            </MenuItem>
            <MenuItem onClick={this.resetColumnSizing} > 
              Reset Column Sizing
            </MenuItem>
        </ContextMenu>
      </div>
    );
  }
} 

ReactDOM.render(<Popup />, document.getElementById('app'));
export default Popup