
import React, { useEffect, useState } from 'react';
import '../css/stop.css';

/**
 * 強制終了時のメッセージの表示
 * @param {{ socket: SocketIOClient.Socket }} props 連想配列として，socketをもつ
 */
export default function Stop(props) {
    /** 強制終了時のメッセージの表示 */
    const [showStop, setShowStop] = useState(false);
    /** 強制終了時のメッセージの内容 */
    const [stopMsg, setStopMsg] = useState('2人以下になったので，ゲームを最初からやり直します');

    useEffect(() => {
        /** socketのイベントハンドラ登録一覧 */
        props.socket.on('in_room', (data) => {
            if (typeof data.stopped !== 'undefined') {
                if (data.stopped) {
                    setTimeout(() => {
                        setStopMsg('2人以下になったので，ゲームを最初からやり直します');
                        setShowStop(true);
                    }, 4000);
                }
            }
        });

    }, [ props.socket ]);

    return (
        <div className="stopMsg" onAnimationEnd={ () => setShowStop(false) } style={ { display: showStop ? 'block' : 'none' } }>{ stopMsg }</div>
    );
}