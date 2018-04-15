//TODO: Fill-out _Torrent_

export class Torrent {
	constructor(hash, rutorrent) {
		this.hash = hash;
		this.rutorrent = rutorrent;
	}

	start() {
		this.rutorrent.sendRPCRequest({
			mode: 'start',
			hash: this.hash
		});
	}
	pause() { //Deprecate?

	}
	stop() {
		this.rutorrent.sendRPCRequest({
			mode: 'stop',
			hash: this.hash
		})
	}
	recheck() {

	}
	delete() {

	}

	getState() {

	}
	getFiles() {
		this.rutorrent.sendRPCRequest({
			mode: 'fls',
			hash: this.hash
		})
	}

	setPriority(priority) {

	}
}