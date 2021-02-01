import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Leave from '../leave';
import '../../css/room.css';
import Matching from '../matching';

/** ボタンの効果音 */
const audio = new Audio('../audio/decision29low.wav');
/** ボタンの効果音の音量 */
audio.volume = 0.1;

/**
 * ルームの選択，リスト，作成フォーム，スタートボタンの表示
 * @param {{ socket: SocketIO.Socket, setMassage: (message: string) => void, setShowStatus: (showStatus: boolean) => void }} props 連想配列として，socket, setAMassage, setShowStatusをもつ
 */
export default function Room(props) {
    /** ルーム名のフォーム */
    const { register, handleSubmit, reset } = useForm();
    /** ルーム全体の表示 */
    const [showRoom, setShowRoom] = useState(false);
    /** ルームの選択画面表示 */
    const [showRoomContent, setShowRoomContent] = useState(true);
    /** ルームリストの内容 */
    const [roomList, setRoomList] = useState(null);
    /** ルーム作成画面表示 */
    const [showRoomCreate, setShowRoomCreate] = useState(false);
    /** ルームリストの表示 */
    const [showRoomList, setShowRoomList] = useState(true);
    /** スタートボタンの表示 */
    const [showStart, setShowStart] = useState(false);
    /** デッキのオプション */
    const [option, setOption] = useState(false);
    /** ルーム名の被り */
    const [showOverlap, setShowOverlap] = useState(false);

    /**
     * ルームに入室したときのハンドラ
     * @param {string} roomname ルーム名
     */
    const roomEntrySubmit = (roomname) => {
        audio.play();
        setShowRoomContent(false);
        props.setShowStatus(true);
        props.socket.emit('room_entry', { roomname : roomname });
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }
    /**
     * ルーム作成フォームの登録ハンドラ
     * @param {{ username: string, roomname: string }} data 連想配列として，username, roomnameをもつ
     * @param {Event} event イベント
     */
    const roomCreateSubmit = (data, event) => {
        audio.play();
        setShowRoomContent(false);
        props.setShowStatus(true);
        props.socket.emit('room_create', { username : data.username, roomname : data.roomname });
        reset();
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    };
    /** ルーム作成ボタンをクリックしたときのハンドラ */
    const clickRoomCreate = () => {
        audio.play();
        setShowRoomList(false);
        setShowRoomCreate(true);
    };
    /** ルームリスト表示をクリックしたときのハンドラ */
    const clickRoomList = () => {
        audio.play();
        setShowRoomCreate(false);
        setShowRoomList(true);
    };
    /** スタートボタンを押したときのハンドラ */
    const clickStart = () => {
        audio.play();
        props.socket.emit('start', { option : option });
        setShowStart(false);
    };

    useEffect(() => {
        /**
         * ルームリストの更新
         * @param {RoomManager} roomManager ルームマネージャー
         */
        const updateRoomList = (roomManager) => {
            if (roomManager.roomList.length === 0 || roomManager.roomList.filter(room => room.game.stageIndex === 0 && room.game.players.length < 6).length === 0) {
                setRoomList(
                    <div className="white">No games at the moment</div>
                );
            } else {
                setRoomList(
                    roomManager.roomList.filter(room => room.game.stageIndex === 0 && room.game.players.length < 6).map((room, index) => {
                        return(
                            <div className="room-list-content" key={ index }>
                                <div className="room-name">{ room.name }</div>
                                <div className="room-decision-button">
                                    <button className="btn btn-primary mb-2" onClick={ () => roomEntrySubmit(room.name)}>Join</button>
                                </div>
                            </div>
                        );
                    })
                );
            }
        };

        // socketのインベントハンドラ登録一覧
        props.socket.on('room', (data) => {
            updateRoomList(data.roomManager);
            setShowRoomContent(true);
            setShowRoom(true);
            setShowStart(false);
        });
        props.socket.on('in_room', (data) => {
            setShowRoomContent(false);
            setShowRoom(true);
            if (data.others.length >= 2 && data.player.isMaster) setShowStart(true);
        });
        // props.socket.on('room_create', () => setShowRoom(false));
        props.socket.on('update_roomlist', (data) => updateRoomList(data.roomManager));
        props.socket.on('entry_player', (data) => {
            if (data.room.game.players.length >= 3 && data.room.game.players[0].socketId === props.socket.id) {
                setShowRoom(true);
                setShowRoomContent(false);
                setShowStart(true);
            }
        });
        props.socket.on('update_player_list', (data) => {
            if (data.game.players.length < 3) {
                setShowStart(false);
            }
        });
        props.socket.on('restart', () => {
            setShowRoomContent(false);
            setShowRoomCreate(false);
            setShowRoomList(false);
            setShowRoom(true);
        });
        props.socket.on('room_name_overlap', () => {
            setShowOverlap(true);
            setShowRoomContent(true);
            props.setShowStatus(false);
        });

    }, [ props.socket ]);

    return (
        <div className="room" style={ { display: showRoom ? 'block' : 'none' } }>
            <div className="room-content" style={ { display: showRoomContent ? 'block' : 'none' } }>
            <div class="container__home">
                <div className="main-home">
                    <h2>Home</h2>
                    <p class="mb-0">These are the games currently available:</p>
                </div>
           
                <div className="room-button">
                    <button onClick={ clickRoomCreate } id="create-room-button" className="btn btn-primary mb-2">
                     Create
                    </button>
                    {/* <button onClick={ clickRoomList } id="join-room-button" className="btn btn-primary mb-2">
                        既存ルームに参加
                    </button> */}
                </div>
                </div>
                <div className="room-create" style={ {display: showRoomCreate ? 'block' : 'none'} }>
                    <div className="room-create-title">Create a game</div>
                    <form className="form-inline" id="roomCreateForm" onSubmit={ handleSubmit(roomCreateSubmit) }>
                        <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                        <input type="text" className="form-control mb-2 mr-sm-2" name="roomname" ref={ register() } placeholder="Name"/>
                        <button type="submit" className="btn btn-primary mb-2">Create</button>
                    </form>
                    <div className="overlap" style={ { display: showOverlap ? 'block' : 'none' } }>このルーム名は既に使用されています<br/>（17文字目以上は切り捨てられます)</div>
                </div>
                <div className="room-list" style={ { display: showRoomList ? 'block' : 'none' } }>
                    { roomList }
                </div>
            </div> 
            <div className="game-start" style={ { display: showStart ? 'block' : 'none' } }>
                <div className="deck-select">
                    <input type="radio" id="default" name="deck" value="default" checked={ !option }/>
                    <label className="deck-select-content" onClick={() => setOption(false)} htmlFor='default'>
                        Default Deck
                    </label>
                    <input type="radio" id="option" name="deck" value="option" checked={ option }/>
                    <label className="deck-select-content" onClick={ () => setOption(true) } htmlFor='option'>
                        みんなの寄せ集め<br/>（みんなが投稿した　<br/>　画像でデッキを作成）
                    </label>
                </div>
                <button onClick={ () => clickStart() } className="btn btn-primary mb-2">
                    Start the game
                </button>
            </div>
            <Matching socket={ props.socket }/>
            <Leave className="room-leave" socket={ props.socket }/>
        </div>
    );
}