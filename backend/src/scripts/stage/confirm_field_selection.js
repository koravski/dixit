'use strict';

/** ただdoneするだけの操作 */
class ConfirmFieldSelection {

    /**
     * ただdoneするだけの操作
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(socket, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        game.findPlayer(socket.id).done();
    }
}

module.exports = ConfirmFieldSelection;