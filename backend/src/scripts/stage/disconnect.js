'use strict';

/**
 * 切断時の操作
 */
class Disconnect {

    /**
     * 切断時の操作
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(socket, roomManager) {
        let room = roomManager.findRoomBySocket(socket); // 切断されたsocketのルームを検索
        if (room != null) {
            socket.leave(room.name); // socketをルームから切り離す
            const player = roomManager.findPlayer(socket); // 切断されたsocketのルームマネージャー上のプレイヤーを検索
            player.disconnect(); // プレイヤーを切断
            room.game.field.cards.filter(card => card.player === socket.id) // 切断されたプレイヤーが出したフィールド上のカード
                .forEach(card => card.player = player.name); // 一時的にプレイヤー名を代入しておく
        }
    }
}

module.exports = Disconnect;