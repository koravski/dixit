import React, { useEffect, useState } from 'react';

/**
 * スコアの表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function ShowScore(props) {
    /** プレイヤーのスコア */
    const [score, setScore] = useState(0);

    useEffect(() => {
        /**
         * スコアの表示
         * @param {{ player: Player }} data 連想配列として，playerをもつ
         */
        const show_score = (data) => {
            setScore(data.player.score);
        }
        /** サーバからemitされたときのイベントハンドラ一覧 */
        props.socket.on('in_room', () => setScore(0));
        props.socket.on('show_answer', (data) => show_score(data));
        props.socket.on('restart', () => setScore(0));

    }, [ props.socket ]);

    return (
        <div id="score">
            <div>SCORE</div>
            <div>{ score }</div>
        </div>
    );
}