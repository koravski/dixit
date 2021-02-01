import React, {useState} from 'react';
import { withCookies } from 'react-cookie';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import $ from 'jquery';

import PlayerCounter from './scripts/playerCounter';
import Chat from './scripts/chat';
import Story from './scripts/story';
import Entry from './scripts/stage/entry';
import Room from './scripts/stage/room';
import Start from './scripts/stage/start';
import HandSelection from './scripts/stage/hand_selection';
import StoryModal from './scripts/stage/modal/story_modal';
import FieldSelection from './scripts/stage/field_selection';
import ShowAnswer from './scripts/stage/modal/show_answer';
import ShowRole from './scripts/stage/show_role';
import Result from './scripts/stage/modal/result';
import Upload from './scripts/upload';
import Status from './scripts/status';
import PlayerList from './scripts/player_list';
import Stock from './scripts/stock'
import Help from './scripts/help';
import Discard from './scripts/discard';
import PlayerDelete from './scripts/player_delete';
import Stop from './scripts/stop';
// スタイルシート
import './App.css';
import './css/game.css';


//const ENDPOINT = "http://34.83.112.24:3000/";
const ENDPOINT = "https://dixin.herokuapp.com/";

const socket = io(ENDPOINT, {
  query: { 'client-id': cookieVal('client-id') }, // クライアントID(プレイヤー名を保持するためのもの)
  transports: ['websocket'],
  upgrade: false,
  timeout: 1800000 // タイムアウト時間を30分に(デフォルトは20秒)
});

// jQuery全体のイベントハンドラ
$(() => $('[data-toggle="tooltip"]').tooltip());
// 接続関係のログ(デバッグ用)
socket.on('connect_timeout', () => console.log('timeout'));
socket.on('reconnect', (num) => console.log('reconnect: ' + num));
socket.on('reconnect_attempt', (num) => console.log('reconnect_attempt: ' + num));
socket.on('reconnecting', (num) => console.log('reconnecting: ' + num));
socket.on('reconnect_error', (error) => console.log('reconnect_error: ' + error));
socket.on('reconnect_failed', () => console.log('reconnect_failed'));
socket.on('connect_error', (error) => console.log('connect_error: ' + error));

function App() {
  /** help */
  const [message, setMessage] = useState('ようこそ！');
  /** お題の内容 */
  const [story, setStory] = useState('');
  /** プレイヤー名 */
  const [name, setName] = useState(null);
  /** 語り部が選んだカードの手札上のインデックス */
  const [masterIndex, setMasterIndex] = useState(null);
  /** 手札から選ばれたカードのソース */
  const [src, setSrc] = useState(null);
  /** ステータス(プレイヤー名とスコア)の表示 */
  const [showStatus, setShowStatus] = useState(false);

  return (
    <div className="container-outer">
      <div className='header'>
        <h1>Loquor</h1>
      </div>
      <div className="game-container">
        <div className='game-core-wrapper'>
          <div className='game-core'>
            {/* <Help message={ message }/> */}
            <Entry socket={ socket } setMessage={ setMessage } setName={ setName } setShowStatus={ setShowStatus }/>
            <Room socket={ socket } setMessage={ setMessage } setName={ setName } setShowStatus={ setShowStatus }/>
            {/* <Upload socket={ socket }/> */}
            <Start socket={ socket } setMessage={ setMessage }/>
            <Story socket={ socket } story={ story }/>
            <HandSelection socket={ socket } setMessage={ setMessage } setMasterIndex={ setMasterIndex } setSrc={ setSrc }/>
            <StoryModal socket={ socket } setStory={ setStory } masterIndex={ masterIndex } src={ src }/>
            <FieldSelection socket={ socket } setMessage={ setMessage }/>
            <ShowAnswer socket={ socket } setMessage={ setMessage } setDiscard/>
            <Result socket={ socket } setMessage={ setMessage }/>
            <Status socket={ socket } name={ name } showStatus={ showStatus } setShowStatus={ setShowStatus }/>
            <PlayerList socket={ socket } name={ name }/>
            <ShowRole socket={ socket } setMessage={ setMessage } />
            <Discard socket={ socket }/>
            <Stock socket={ socket }/>
            <PlayerDelete socket={ socket }/>
            <Stop socket={ socket }/>
          </div>
        </div>
        <div className="game-chat">
          <PlayerCounter socket={ socket }/>
          {/* <Chat socket={ socket }/> */}
        </div>
      </div>
    </div>
  );
}

/**
 * cookieの取得
 * @param {string} key cookieのキー名
 */
function cookieVal(key) {
  return ((document.cookie + ';').match(key + '=([^¥S;]*)')||[])[1];
}

export default withCookies(App);