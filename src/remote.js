import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {ruTorrent, Torrent} from 'rutorrent'

class Remote extends Component {
  async render() {
    var rutorrent = new ruTorrent();
    var torrents = await rutorrent.getTorrents();
    console.log(torrents[0].getStatus());
  }
} 

ReactDOM.render(<Remote />, document.getElementById('app'));
export default Remote