'use strict';
const Game = require('../game');

/**
 * リザルト画面でもう一度ゲームをするときの操作
 */
class Restart {

    /**
     * リザルト画面でもう一度ゲームをするときの操作
     * @param {SocketIO.Server} io サーバのsocketIO
     * @param {SocketIO.Socket} socket socket
     * @param {RoomManager} roomManager ルームマネージャー
     */
    static do(io, socket, roomManager) {
        let room = roomManager.findRoomBySocket(socket);
        let player = roomManager.findPlayer(socket);
        if (room !== null && room.game.stageIndex !== 0 
            && !room.nextGame.players.some((each_player) => each_player.socketId === player.socketId)) {
            player.reset();
            room.game.deletePlayer(socket); // 現在のゲームから削除
            room.nextGame.addPlayer({ player: player }); // 次のゲームに追加
            // room.game.players.forEach(player => io.to(player.socketId).emit('update_number_of_player', { num: room.game.players.length }));
            var others = new Array();
            room.nextGame.players.forEach(other => {
                if (player != other) {
                    others.push(other);
                }
            });
            if (others.length === 0) {
                player.isMaster = true;
            } else {
                player.done();
            }
            room.game.players.forEach(player => io.to(player.socketId).emit('update_player_list', { game : room.game }));
            room.nextGame.players.forEach(player => io.to(player.socketId).emit('update_player_list', { game : room.nextGame }));
            socket.emit('restart', { others : others, player : player, game : room.nextGame });
            if (room.game.players.length === 0) {
                room.game = room.nextGame;
                room.nextGame = new Game();
                io.to(room.game.players[0].socketId).emit('entry_player', { room : room });
                io.sockets.emit('update_roomlist', { roomManager : roomManager });
            }
        }
    }
}

module.exports = Restart;
