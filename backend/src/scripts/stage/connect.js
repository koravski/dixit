'use strict';
/**
 * クライアントがサーバに接続したとき(ハンドシェイク時)の操作
 */
class Connect {

    /**
     * クライアントがサーバに接続したとき(ハンドシェイク時)の操作
     * @param {SocketIO.Server} io サーバ側のsocketIO
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(io, socket, roomManager) {
        const username = decodeURI(socket.handshake.query['client-id']);
        const player = roomManager.findPlayerByAgent(username, socket);
        const room = roomManager.findRoomByPlayerName(username);
        if (player != null) {
            player.connect = true;
            if (room != null) {
                if (room.game == null) {
                    // 
                }
                room.game.comeback(player, socket, roomManager);
                socket.join(room.name);
            } else {
                // entryはしているがroomには入っていない
                player.socketId = socket.id;
                socket.emit('room', { roomManager: roomManager });
            }
        } else {
            // entryもしていない
        }
        io.sockets.emit('update_number_of_player', { num: roomManager.players.length });
    }
}

module.exports = Connect;