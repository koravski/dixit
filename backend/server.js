'use strict';
// サーバーサイド

// 必要なモジュールを読み込む
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

const utils = require('./src/scripts/utils');
// ステージごとのファイル読み込み
const RoomManager = require('./src/scripts/room_manager');
const wait = require('./src/scripts/stage/wait');
const connect = require('./src/scripts/stage/connect');
const entry = require('./src/scripts/stage/entry');
const room_create = require('./src/scripts/stage/room_create');
const room_entry = require('./src/scripts/stage/room_entry');
const start = require('./src/scripts/stage/start');
const story_selection = require('./src/scripts/stage/story_selection');
const others_hand_selection = require('./src/scripts/stage/others_hand_selection');
const field_selection = require('./src/scripts/stage/field_selection');
const ConfirmFieldSelection = require('./src/scripts/stage/confirm_field_selection');
const ConfirmAnswer = require('./src/scripts/stage/confirm_answer');
const restart = require('./src/scripts/stage/restart');
const leave = require('./src/scripts/stage/leave');
const disconnect = require('./src/scripts/stage/disconnect');

const expire = 60; // 切断後，部屋から追放するまでの猶予時間(秒)
const interval = 30; // setIntervalの間隔(ms)
let sockets = [];
// ゲームオブジェクト作成
let roomManager = new RoomManager();
// 接続が完了したときに呼び出す関数
io.on('connection', (socket) => {
    // 行動する必要がない時
    socket.on('wait', () => wait.do(socket, roomManager));
    // クライアント接続時
    setTimeout(() => connect.do(io, socket, roomManager), 100);
    // クライアントからentryがemitされた時
    socket.on('entry', (data) =>  entry.do(data, io, socket, roomManager));
    // クライアントからroom_createがemitされた時
    socket.on('room_create', (data) => room_create.do(data, io, socket, roomManager));
    // クライアントからroom_entryがemitされた時
    socket.on('room_entry', (data) => room_entry.do(data, io, socket, roomManager));
    // クライアントからstartがemitされた時
    socket.on('start', (data) => start.do(data, socket, roomManager));
    // クライアントからstory_selectionがemitされた時
    socket.on('story_selection', (data) => story_selection.do(socket, io, data.story, data.masterIndex, roomManager));
    // クライアントからstory_selectionがemitされた時
    socket.on('confirm_story_selection', (data) => story_selection.confirm(socket, data.story, data.masterIndex, roomManager));
    // クライアントからothers_hand_selectionがemitされた時
    socket.on('others_hand_selection', (data) => others_hand_selection.do(socket, io, data.index, roomManager));
    // クライアントからfield_selecitonがemitされた時
    socket.on('field_selection', (data) => field_selection.do(socket, data.index, roomManager));
    // クライアントからconfirm_field_selectionがemitされた時
    socket.on('confirm_field_selection', () => ConfirmFieldSelection.do(socket, roomManager));
    // クライアントからconfirm_answerがemitされた時
    socket.on('confirm_answer', () => ConfirmAnswer.do(socket, roomManager));
    // クライアントからrestartがemitされた時
    socket.on('restart', () => restart.do(io, socket, roomManager));
    // TODO: deletegameに変更
    // クライアントからleaveがemitされた時
    socket.on('leave', () => leave.do(io, socket, roomManager));

    // 通信終了時(ブラウザを閉じる/リロード/ページ移動)
    socket.on('disconnect', () => disconnect.do(socket, roomManager));
    // チャットのアップデート
    socket.on('chat_send_from_client', (data) => utils.updateChat(io, socket, roomManager, data));
    // 画像のアップロード
    socket.on('upload', (data) => utils.uploadFile(data.filename, data.image, roomManager.findPlayer(socket).name));
});

setInterval(() => {
    // 全プレイヤーがステージ移行可能ならば移行する
    roomManager.roomList.forEach(room => {
        if (room.game.isAllDone() || room.game.isFinished()) { // 全てのプレイヤーが次のステージにいける状態
            room.game.nextStage(io);
        }
        room.checkConnection(io, expire, interval);
    });
}, interval);

app.use('/', express.static(__dirname + '/build'));

// HTTPサーバを生成する
// サーバー生成時にfunction以下のリクエストリスナーが登録されるため
// クライアントからHTTPリクエストが送信されるたびにfunctionが実行される
// ここではヘッダ出力(writeHead)とindex.htmlの出力(readFileSync)
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/build/index.html'));
});


//ローカルデバッグ用
// server.listen(4001, () => {
//   utils.log('Starting server on port 4001');
// });
// サーバデプロイ用
server.listen(3000, () => {
    utils.log('Starting server on port 3000');
});