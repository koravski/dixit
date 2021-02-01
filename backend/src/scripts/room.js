const Player = require("./player");
const Game = require("./game");

/**
 * ルームのクラス
 */
class Room {

    /**
     * ルームのコンストラクター
     * @param {string} name ルーム名
     */
    constructor(name) {
        this.name = name;
        this.game = new Game();
        this.players = [];
        this.nextGame = new Game();
        this.playerDeleted = { isDeleted: false, name: null };
    }

    /**
     * ルームにプレイヤーをエントリーさせる
     * @param {Player} player プレイヤー
     */
    entry(player) {
        this.players.push(player);
        this.game.addPlayer({player: player});
        return player;
    }

    /**
     * socketを用いてルームにいるプレイヤーを取得
     * @param {SocketIO.Socket} socket socket
     */
    findPlayer(socket) {
        return this.players.filter(player => player.socketId === socket.id)[0];
    }

    /**
     * socketを用いてルームからプレイヤーを削除
     * @param {SocketIO.Socket} socket socket
     */
    deletePlayer(socket) {
        this.game.deletePlayer(socket);
        this.players.forEach((player, index) => {
            if (player != null && player.socketId === socket.id) {
                this.players.splice(index, 1);
                this.playerDeleted = { isDeleted: true, name: player.name };
            }
        });
    }

    /** 
     * 接続のタイムアウトのチェック
     * @param {SocketIO.Server} io socketIO
     * @param {number} expire 切断後，部屋から追放するまでの猶予時間(秒)
     * @param {number} interval setIntervalの間隔(ms)
     */
    checkConnection(io, expire, interval) {
        this.game.players.forEach(player => {
            if (player.connect) {
                player.timer = 0;
            } else {
                if (player.timer++ > expire * 1000 / interval) {
                    this.deletePlayer({ id: player.socketId });
                    player.reset();
                    if (this.game.players.length < 3) {
                        this.game.stop = true;
                    }
                }
            }
        });
        if (this.playerDeleted.isDeleted) {
            io.to(this.name).emit('update_player_list', { game: this.game, deletedPlayer: this.playerDeleted.name });
            this.playerDeleted = { isDeleted: false, name: null }; // リセット
        }
        if (this.game.stop) { // ゲームを強制終了し，マッチング画面に戻る
            this.game.reset();
            this.players.forEach(player => this.game.addPlayer({ player : player }));
            this.players.forEach((player, index) => {
                player.reset();
                if (index === 0) { // 最初の人はルームマスターに
                    player.isMaster = true;
                } else { // 他の人はdone
                    player.done();
                }
                let others = new Array();
                this.game.players.forEach(other => {
                    if (player != other) {
                        others.push(other);
                    }
                });
                io.to(player.socketId).emit('in_room', { game : this.game, player : player, others : others, stopped : true });
            });
        }
    }
}


module.exports = Room;