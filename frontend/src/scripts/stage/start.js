
import React, { useEffect, useState } from 'react';
import '../../css/start.css';

/**
 * スタートメッセージの表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function Start(props) {
    /** スタートメッセージの表示 */
    const [showStart, setShowStart] = useState(false);
    /** スタートメッセージの内容 */
    // const [startMsg, setStartMsg] = useState('Game Start');
    const [startMsg, setStartMsg] = useState('');

    useEffect(() => {
        const game_start = (data) => {
            console.log(data.game);
            if(data.game.round === 1){
                setShowStart(true);
            }
        };

        /** socketのイベントハンドラ登録一覧 */
        props.socket.on('hand_selection', (data) => game_start(data));

    }, [ props.socket ]);

    return (
        <div className="startMsg" onAnimationEnd={ () => setShowStart(false) } style={ { display: showStart ? 'block' : 'none' } }>{ startMsg }</div>
    );
}