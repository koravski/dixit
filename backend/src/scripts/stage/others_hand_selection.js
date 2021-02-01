'use strict';

/**
 * 聞き手がお題に沿ったカードを手札から選択する時の操作
 */
class OthersHandSelection {

    /**
     * 聞き手がお題に沿ったカードを手札から選択する時の操作
     * @param {SocketIO.Socket} socket socket 
     * @param {SocketIO.Server} io サーバ側のsocketIO
     * @param {number} index フィールドに出したカードの手札上のインデックス
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(socket, io, index, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        let player = game.findPlayer(socket.id);
        if (!player.isDone()) {
            player.selectFromHand(index);
            // 手札の更新
            let card = player.hand.pop();
            game.field.add(card, game);
            socket.emit('update_hand', { player: player });
            // フィールドの更新
            game.players.forEach(player => io.to(player.socketId).emit('update_field_with_back', { game: game }));
            if (game.players.length == 3 && game.field.cards.filter(card => card.player === player.socketId).length < 2) {
                socket.emit('others_hand_selection', { player: player, game: game });
            } else {
                player.done();
            }
        }
    }
}

module.exports = OthersHandSelection;