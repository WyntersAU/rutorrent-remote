import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import axios from 'axios'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { showMenu } from 'react-contextmenu/modules/actions'

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };

    this.addItemToTable = this.addItemToTable.bind(this);
    this.getTorrents = this.getTorrents.bind(this);

    this.handleOnResizeChange = this.handleOnResizeChange.bind(this);
    this.handleResized = this.handleResized.bind(this);

    this.getColumns = this.getColumns.bind(this);
    this.formatBytes = this.formatBytes.bind(this);

    this.getRowRenderer = this.getRowRenderer.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);    

    this.getTorrents();
  }

  //https://stackoverflow.com/a/18650828
  formatBytes(bytes,decimals) {
  	if(bytes == 0) return '0 B';
  	var k = 1024,
  	    dm = decimals || 2,
  	    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  	    i = Math.floor(Math.log(bytes) / Math.log(k));
  	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  formatSpeed(bytes,decimals) {
    if(bytes == 0) return '0 B/s';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  handleCellClick(click) {
    
  }

  getRowRenderer(row) {
    return (
      <ContextMenuTrigger id={row.value}>
        <span>{row.value}</span>

        <ContextMenu id={row.value}>
          <MenuItem onClick={this.handleCellClick}> 
            Start
          </MenuItem>
        </ContextMenu>

      </ContextMenuTrigger>
    );
  }


  getColumns() {
  	var columns = [
      	{ Header: "Name", accessor: "name", width: 280},
      	{ Header: "Status", accessor: "status", width: 58 },
      	{ Header: "Size", accessor: "size", width: 70 },
      	{ Header: "Done", accessor: "done", width: 40 },
      	{ Header: "Downloaded", accessor: "downloaded", width: 80 },
      	{ Header: "Uploaded", accessor: "uploaded", width: 73 },
      	{ Header: "Ratio", accessor: "ratio", width: 40 },
      	{ Header: "UL", accessor: "ul", width: 70 },
      	{ Header: "DL", accessor: "dl", width: 70 }
      ];

    return columns;
  }

  async getTorrents() {
  	var params = new URLSearchParams();
  	params.append('mode', 'list'); 
  	var torrents = (await axios.post('<REDACTED>', params)).data;
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


  		var torrent = {
  			name: name,
  			status: "Seeding", 
  			size: this.formatBytes(size),
  			//size_b: size,
  			done: +(downloaded / size * 100).toFixed(2) + "%",
  			downloaded: this.formatBytes(+downloaded),
  			//downloaded_b: downloaded,
  			uploaded: this.formatBytes(+uploaded),
  			//uploaded_b: uploaded,
  			ratio: +(ratio / 1000).toFixed(3),
  			ul: this.formatSpeed(+ul),
  			dl: this.formatSpeed(+dl)
  		};
  		data.push(torrent);
    }
  	this.setState({
  		data: data
  	});
  }

  addItemToTable(item) {
    this.setState(ps => ({
      data: [...ps.data, item]
    }));
  }
  handleResized() {
  	var state = JSON.parse(localStorage.getItem('table'));
  	
  	if (!state) {
  		state = [];
  		this.getColumns().forEach((column) => {
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
        		  noDataText="Fetching information from ruTorrent"
              getTdProps= {(state, rowInfo, column, instance) => {
                return {
                  onContextMenu: (e) => {
                    e.preventDefault();
                    //console.log(e);
                   // console.log(rowInfo);
                    showMenu({
                      position: {x:e.pageX, y:e.pageY},
                      target: e.target,
                      id: 'start-stop-delete'
                    });
                  }
                }
              }}
              data={this.state.data}
              columns={this.getColumns()}
              pageSize={this.state.data.length || 3}
              showPagination={false}

              onResizedChange={this.handleOnResizeChange}
              resized={this.handleResized()}
              style={{
                  height: 'auto',
              }}
              className="-highlight"
        />
        <ContextMenu id='start-stop-delete'>
          <MenuItem onClick={this.handleCellClick}> 
            Start
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
} 

ReactDOM.render(<Popup />, document.getElementById('app'));
export default Popup