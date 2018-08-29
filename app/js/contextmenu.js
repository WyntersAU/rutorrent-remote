/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ({

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initContextMenu = initContextMenu;
function initContextMenu() {
    browser.contextMenus.create({
        id: "upload-to-rutorrent",
        title: "Upload to ruTorrent",
        icons: {
            "32": "icons/upload-32.png"
        },
        contexts: ["link"]
    });

    browser.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "upload-to-rutorrent") {
            getTorrentFile(info, tab).then(function (response) {
                uploadToRutorrent(response).then(function (uploaded) {
                    notify(uploaded);
                }).catch(function (error) {
                    notify(error.message);
                });
            }).catch(function (error) {
                notify(error.message);
            });
        }
    });
}

function notify(message) {
    browser.notifications.create('', { type: "basic", title: "ruTorrent Remote", message: message });
}

function getTorrentFile(info, tab) {

    var promise = new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open('GET', info.linkUrl, true);

        request.onreadystatechange = function () {
            if (request.readyState !== XMLHttpRequest.DONE) return;
            if (!/\.torrent/.test(request.getAllResponseHeaders())) {
                reject(new Error('Unable to determine whether file is a torrent'));
            }

            resolve(request.response);
        };

        request.send(null);
    });

    return promise;
}
function uploadToRutorrent(response) {
    return browser.storage.local.get().then(options => {
        var promise = new Promise((resolve, reject) => {
            if (options.url == null) {
                reject(new Error("Goto Add-ons -> ruTorrent Remote -> Options and set the options."));
                return;
            }

            var formData = new FormData();
            formData.append('torrent_file', response, (Math.random() * response.size).toString() + ".torrent");

            var r = new XMLHttpRequest();
            r.timeout = 5000;

            var url = '';
            var auth = options.username + ':' + options.password + '@';
            if (options.username.length > 0) url = options.url.replace(":\/\/", "://" + auth);
            r.open('POST', url + '/php/addtorrent.php', true);
            r.onload = function () {
                if (this.status == 200) {
                    resolve("Uploaded");
                } else {
                    reject(new Error("Failed to upload: " + this.status));
                }
            };
            r.ontimeout = function (e) {
                reject(new Error("Timed out"));
            };
            r.send(formData);
        });
        return promise;
    });
}

/***/ })

/******/ });
//# sourceMappingURL=contextmenu.js.map