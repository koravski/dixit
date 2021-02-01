'use strict';

/** ただdoneするだけの操作 */
class ConfirmAnswer {

    /**
     * ただdoneするだけの操作
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(socket, roomManager) {
        if (roomManager.findRoomBySocket(socket).game.stage === 'show_answer') {
            roomManager.findPlayer(socket).done();
        }
    }
}

module.exports = ConfirmAnswer;