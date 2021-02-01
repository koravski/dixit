'use strict';

const utils = require('../utils');

/**
 * フィールド選択時の操作
 */
class FieldSelection {

    /**
     * フィールド選択時の操作
     * @param {SocketIO.Socket} socket socket 
     * @param {number} index このsocketのプレイヤーがフィールドで選んだカードのフィールド上のインデックス
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(socket, index, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        utils.logWithStage(game.stage, `socket id: [${ socket.id }]\'s Player was selected.`);
        // 答えを集計
        const id = socket.id;
        const cardIndex = index;
        let dict = {}
        dict['id'] = id;
        dict['cardIndex'] = cardIndex;
        if (game.answers.some(element => element.id === id)) {
            game.answers.filter(element => element.id === id)[0].cardIndex = cardIndex;
        } else {
            game.answers.push(dict);
        }
    }
}

module.exports = FieldSelection;