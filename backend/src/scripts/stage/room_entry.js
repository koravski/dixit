'use strict';

/**
 * ルームのエントリー時の操作
 */
class RoomEntry {

    /**
     * ルームのエントリー時の操作
     * @param {{ roomname: string }} data 連想配列として，roomnameをもつ
     * @param {SocketIO.Server} io サーバのsocketIO
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(data, io, socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        if (player != null) {
            player.isMaster = false;
            socket.join(data.roomname); // socketをルームにjoin
            let room = roomManager.findRoomByName(data.roomname);
            room.entry(player); // playerをルームにいれる
            if (room.players.length > 1) { // ルームマスターでなければ
                player.done(); // doneにする
            } else { // ルームマスターの場合は
                player.isMaster = true; // isMasterをtrueにする
            }
            io.to(data.roomname).emit('entry_player', { room: room });
            io.to(data.roomname).emit('update_player_list', { game: room.game });
        } else {
            // TODO: 人数制限によって削除される
            console.log('capacity over');
        }
    }
}

module.exports = RoomEntry;