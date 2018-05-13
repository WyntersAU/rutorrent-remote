import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import axios from 'axios'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

var utilities = require("utilities.js");
var columns = [
    { Header: "Name", accessor: "name", width: 280 },
    { Header: "Status", accessor: "status", width: 57 },
    { Header: "Size", accessor: "size", width: 68 },
    { Header: "Done", accessor: "done", width: 46 },
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
    params.append('cmd', 'd.custom=addedtime');
    var url = (await browser.storage.local.get('url')).url.replace(/(https?:\/\/)/, '$1' + (await browser.storage.local.get('username')).username + ':' + (await browser.storage.local.get('password')).password + '@');

  	var torrents = (await axios.post(url + '/plugins/httprpc/action.php', params)).data;
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
        added: added
  		};
  		data.push(torrent);
    }
  	this.setState({
  		data: data
  	});

    setTimeout(this.getTorrents, 1000);
  }

  handleResized() {
  	var state = JSON.parse(localStorage.getItem('table'));
  	
  	if (!state) {
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
        <ContextMenuTrigger id="start-stop-delete" holdToDisplay="1000">
	        <ReactTable
	        	  noDataText="Fetching information from ruTorrent"

	              data={this.state.data}
	              columns={columns}
	              pageSize={this.state.data.length || 3}
	              showPagination={false}
                defaultSorted={[
                  {
                    id: "added",
                    desc: true
                  }
                ]}
	              onResizedChange={this.handleOnResizeChange}
	              resized={this.handleResized()}
	              style={{
	                  height: 'auto',
	              }}
	              className="-highlight"
	        />
	    </ContextMenuTrigger>

        <ContextMenu id='start-stop-delete'>
          <MenuItem onClick={this.handleCellClick}> 
            Start
          </MenuItem>
          <MenuItem>
          	Stop
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
} 

ReactDOM.render(<Popup />, document.getElementById('app'));
export default Popup