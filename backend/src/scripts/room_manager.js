const Player = require("./player");
const Room = require("./room")
const utils = require('./utils');
const fs = require('fs');

/**
 * ルームマネージャーのクラス
 * 
 */
class RoomManager {

    /** ルームマネージャーコンストラクタ */
    constructor() {
        /** 
         * ルームリスト
         * @type {Room[]}
         */
        this.roomList = [];
        /** 
         * プレイヤーリスト
         * @type {Player[]}
         */
        this.players = [];
    }

    /**
     * プレイヤーの追加
     * @param {string} name プレイヤー名
     * @param {SocketIO.Socket} socket socket 
     */
    addPlayer(name, socket) {
        let player = new Player({ socketId: socket.id, username: name, socket: socket });
        this.players.push(player);
        if (this.players.length > 20) {
            player = this.players[0];
            if (fs.existsSync(`${ utils.path }/uploaded/${ player.name }`)) {
                fs.rmdir(`${ utils.path }/uploaded/${ player.name }`, { recursive: true }, (err) => console.log(err));
            }
            this.deletePlayer(player.socketId);
        }
        return player;
    }

    /**
     * socketを用いたプレイヤーの検索
     * @param {SocketIO.Socket} socket socket 
     */
    findPlayer(socket) {
        let array = this.players.filter( player => player.socketId === socket.id );
        return array.length === 0 ? null : array[0];
    }

    /**
     * name(client-id)によるプレイヤー検索
     * @param {string} name プレイヤー名 
     * @param {SocketIO.Socket} socket socket 
     */
    findPlayerByAgent(name, socket) {
        const useragent = socket.request.headers['user-agent'];
        const address = socket.handshake.address;
        let array = this.players.filter( player => player.name === name 
            && player.agent === useragent && player.address === address );
        return array.length === 0 ? null : array[0];
    }

    /**
     * ルームの作成
     * @param {string} name ルーム名 
     */
    createRoom(name) {
        if (name.length > 16) {
            name = name.slice(0, 16);
            name = name + '...';
        } 
        let room = null;
        if (this.findRoomByName(name) == null) {
            room = new Room(name);
            this.roomList.push(room);
        }
        return room;
    }

    /**
     * ルーム名によるルームの検索
     * @param {string} name ルーム名 
     */
    findRoomByName(name) {
        const array = this.roomList.filter(room => room.name === name);
        return array.length === 0 ? null : array[0];
    }

    /**
     * socketによるルームの検索
     * @param {SocketIO.Socket} socket socket
     */
    findRoomBySocket(socket) {
        const array = this.roomList.filter(room => room.players.some(player => player.socketId === socket.id));
        return array.length === 0 ? null : array[0];
    }

    /**
     * プレイヤー名によるルームの検索
     * @param {string} playername プレイヤー名 
     */
    findRoomByPlayerName(playerName) {
        const array = this.roomList.filter(room => room.players.some(player => player.name === playerName));
        return array.length === 0 ? null : array[0];
    }

    /**
     * ルームの削除
     * @param {string} name ルーム名 
     */
    deleteRoom(name) {
        this.roomList.splice(this.roomList.indexOf(name), 1);
    }

    /**
     * socketIDによるプレイヤーの削除
     * @param {string} id socketID
     */
    deletePlayer(id) {
        let room = this.findRoomBySocket({ id: id });
        if (room != null) {
            room.deletePlayer({ id: id });
        }
        this.players.forEach((player, index) => {
            if (player != null && player.socketId === id) {
                this.players.splice(index, 1);
            }    
        });
    }

}

module.exports = RoomManager;