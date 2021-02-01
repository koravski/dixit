'use strict';
const utils = require('../utils');

/**
 * エントリーフォームが送られて来たときの操作
 */
class Entry {

    /**
     * エントリーフォームが送られて来たときの操作
     * @param {{ username: string }} data 連想配列として，usernameをもつ
     * @param {SocketIO.Server} io サーバのsocketIO
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(data, io, socket, roomManager) {
        if (!roomManager.players.some(player => player.name === data.username)) { // プレイヤー名の被りなし
            // プレイヤー追加
            let player = roomManager.addPlayer(data.username, socket);
            // 全クライアントのプレイヤー人数表示更新
            io.sockets.emit('update_number_of_player', { num : roomManager.players.length });
            socket.emit('room', { roomManager : roomManager, player : player });
            setTimeout(() => {
                utils.logWithStage('entry', `Player Name: [${ player.name }] ([${ player.socketId }]) joined.`);
            }, 200);
        } else {
            socket.emit('username_duplication');
        }
    }

}

module.exports = Entry;