'use strict';

/** ただdoneするだけの操作 */
class Wait {

    /**
     * ただdoneするだけの操作
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(socket, roomManager) {
        const player = roomManager.findPlayer(socket);
        player.done();
    }
}

module.exports = Wait;