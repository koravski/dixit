
import React, { useState, useEffect } from 'react';
import '../css/upload.css';

/**
 * 退室ボタンの表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function Leave(props) {
    /** 退室ボタンの表示 */
    const [showLeave, setShowLeave] = useState(false);
    /** 退室ボタンのクラス名 */
    const className = `btn btn-warning mb-2 ${ props.className }`;

    useEffect(() => {
        // socketのイベントハンドラ登録一覧
        props.socket.on('room', () => setShowLeave(false));
        props.socket.on('in_room', () => setShowLeave(true));
        props.socket.on('entry_player', () => setShowLeave(true));
        props.socket.on('show_start', () => setShowLeave(true));
        props.socket.on('hand_selection', () => setShowLeave(false));
        props.socket.on('result', () => setShowLeave(true));
        props.socket.on('restart', () => setShowLeave(true));

    }, [ props.socket ]);

    const handleleave = () => {
        console.log("leave");
        if(typeof props.handle !== 'undefined') {
            props.handle();
        }
        props.socket.emit('leave');
    }

    return (
        <button onClick={ handleleave } id="leave-room-button" style={ { display: showLeave ? 'block' : 'none' } } className={ className } >
           Leave
        </button>
    );
}