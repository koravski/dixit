'use strict';
const room_entry = require('./room_entry');

/**
 * ルーム作成時の操作
 */
class RoomCreate {

    /**
     * ルーム作成時の操作
     * @param {{ roomname: string }} data 連想配列として，roomnameをもつ
     * @param {SocketIO.Server} io サーバのsocketIO
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(data, io, socket, roomManager) {
        let room = roomManager.createRoom(data.roomname);
        if (room == null) { // 指定のroomnameが既に存在する場合
            socket.emit('room_name_overlap');
        } else {
            roomManager.findPlayer(socket).isMaster = true;
            io.sockets.emit('update_number_of_player', { num : roomManager.players.length }); // 全クライアントのプレイヤー人数表示更新
            io.sockets.emit('update_roomlist', { roomManager : roomManager });
            socket.emit('show_start'); // スタートボタンの表示
            room_entry.do({ roomname: room.name, game: room.game }, io, socket, roomManager);
        }
    }

}

module.exports = RoomCreate;