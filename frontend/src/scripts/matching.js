import React, { useState, useEffect } from 'react';

/**
 * マッチング中のスピナー表示<br>
 * 画面下の方に表示される
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function Matching(props) {

    /** マッチングの表示 */
    const [showMatching, setShowMatching] = useState(false);

    useEffect(() => {
        // socketのイベントハンドラ登録一覧
        props.socket.on('update_player_list', (data) => {
            if (data.game.stage === 'in_room') {
                setShowMatching(true);
            }
        });
        props.socket.on('room', () => setShowMatching(false));
        props.socket.on('in_room', () => setShowMatching(true));
        props.socket.on('hand_selection', () => setShowMatching(false));

    }, [ props.socket ]);

    return (
        <div className="text-center matching" style={ { display: showMatching ? 'block' : 'none' } }>
            <button className="btn btn-primary" type="button" disabled>
            Please wait...  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
               
            </button>
        </div>
    );
}