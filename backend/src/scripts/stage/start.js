'use strict';

/** ルームマスターがスタート完了時 */
class Start {

    /**
     * ルームマスターがスタート完了時
     * @param {{ option: boolean }} data 連想配列として，optionをもつ 
     * @param {*} socket socket
     * @param {*} roomManager ルームマネージャー
     */
    static do(data, socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        let room = roomManager.findRoomBySocket(socket);
        room.game.createDeck(data.option); // ゲームのデッキ作成
        player.done(); // ルームマスターをdoneにする
    }
}

module.exports = Start;