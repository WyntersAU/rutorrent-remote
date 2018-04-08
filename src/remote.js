import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {ruTorrent} from 'rutorrent'


class Remote extends Component {
  async render() {
    var rutorrent = new ruTorrent('REDACTED', 'REDACTED', 'REDACTED');
  }
} 

ReactDOM.render(<Remote />, document.getElementById('app'));
export default Remote