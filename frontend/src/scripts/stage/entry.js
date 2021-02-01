import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import '../../css/entry.css';

/** 空白のみの正規表現 */
const REGEX = /( |　)+/g;
/** ボタンの効果音 */
const audio = new Audio('../audio/decision29low.wav');
/** ボタンの効果音の音量 */
audio.volume = 0.1;

/**
 * エントリーの表示とクッキーのセット
 * @param {{ sokcet: SocketIO.Socket, setMessage: (message: string) => void, setName: (name: string) => void }} props 連想配列として，socket, setMassage, setNameをもつ
 */
export default function Entry(props) {
    /** エントリーフォーム */
    const { register, handleSubmit, reset } = useForm();
    /** エントリーフォームの表示 */
    const [show, setShow] = useState(true);
    /** cookieの設定 */
    const [, setCookie] = useCookies(['client-id']);
    /** ユーザー入力エラー */
    const [ userAlert , setUserAlert] = useState("");

    useEffect(() => {
        /**
         * 復帰時の操作
         * @param {string} name プレイヤー名
         */
        const comeback = (name) => {
            setShow(false);
            props.setName(name);
        };
        /**
         * プレイヤー名の初期化
         * @param {{ player: Player }} data 連想配列として，playerをもつ
         */
        const initializeName = (data) => {
            setUserAlert("");
            setShow(false);
            if (typeof data.player !== 'undefined') {
                setCookie('client-id', data.player.name, {path: '/'});
                props.setName(data.player.name);
            }
        };

        /** サーバーからのemitを受け取るイベントハンドラ登録一覧 */
        props.socket.on('room', (data) => initializeName(data));
        props.socket.on('in_room', (data) => comeback(data.player.name));
        props.socket.on('hand_selection', (data) => comeback(data.player.name));
        props.socket.on('others_hand_selection', (data) => comeback(data.player.name));
        props.socket.on('field_selection', (data) => comeback(data.player.name));
        props.socket.on('show_answer', (data) => comeback(data.player.name));
        props.socket.on('result', (data) => comeback(data.player.name));
        props.socket.on('username_duplication', () => setUserAlert("The username is already in use"));

    }, [ props.socket ]);

    /**
     * エントリーフォーム入力時の動作
     * @param {{ username: string }} data 連想配列として，usernameをもつ
     * @param {Event} event イベント
     */
    const onSubmit = (data, event) => {
        if (data.username.length > 8) { // 9文字以上の場合
            setUserAlert("Username is too long (8 characters or less)");
            reset();
            return;
        } else if (data.username.match(REGEX) != null) { // 0文字の場合
            setUserAlert("空白のみの名前は無効です");
            reset();
            return;
        }
        audio.play();
        props.socket.emit('entry', { username : data.username }); // サーバーに'entry'を送信
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        reset();
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    };

    return (
        <div className="entry-wrapper" style={ { display: show ? 'block' : 'none' } }>
            <div className="entry-content">
                <div className="welcome-word">Please pick an username.</div>
                <form className="form-inline" id="entryForm" onSubmit={ handleSubmit(onSubmit) }>
                    <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" name="username" ref={ register() } placeholder="I want to be called" required/>
                    <button type="submit" className="btn btn-primary mb-2">Start playing</button>
                    <div className="overlap" id="username-alert">{ userAlert }</div>
                </form>
            </div>
        </div>
    );
}