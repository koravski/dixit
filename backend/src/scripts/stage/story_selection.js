'use strict';

/**
 * お題を選択したときの操作
 */
class StorySelection {

    /**
     * お題を選択したときの操作
     * @param {SocketIO.Socket} socket socket
     * @param {SocketIO.Server} io サーバ上のsocketIO 
     * @param {string} story お題の内容
     * @param {number} masterIndex 語り部がフィールド上に出したカードの手札上のインデックス
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(socket, io, story, masterIndex, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        game.setStory(story); // お題のセット
        let player = game.findPlayer(socket.id);
        player.selectFromHand(masterIndex);
        // 手札の更新
        let card = player.hand.pop();
        game.field.add(card, game);
        socket.emit('update_hand',{player:player});
        // フィールドの更新
        game.players.forEach(player => io.to(player.socketId).emit('update_field_with_back', { game: game }));

        game.players.forEach(eachPlayer => { // 全員doneにする
            eachPlayer.done();
        });
    }
    /**
     * お題を選択したときの操作
     * @param {SocketIO.Socket} socket socket
     * @param {string} story お題の内容
     * @param {number} masterIndex 語り部がフィールド上に出したカードの手札上のインデックス
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static confirm(socket, story, masterIndex, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        let player = roomManager.findPlayer(socket);
        if (!game.field.cards.some(card => card.player === socket.id)) {
            socket.emit('confirm_story_selection', { story : story, masterIndex : masterIndex, player: player });
        }
    }
}

module.exports = StorySelection;