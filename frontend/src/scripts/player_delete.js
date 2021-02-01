import React, { useEffect, useState } from 'react';
import '../css/player_delete.css';

/**
 * プレイヤー離脱メッセージの表示
 * @param {{ socket: SocketIOClient.Socket }} props 連想配列として，socketをもつ
 */
export default function PlayerDelete(props) {
    /** プレイヤー離脱メッセージの表示 */
    const [showDelete, setShowDelete] = useState(false);
    /** プレイヤー離脱メッセージの内容 */
    const [deleteMsg, setDeleteMsg] = useState('');

    useEffect(() => {
        const displayDelete = (data) => {
            if (typeof data.deletedPlayer !== 'undefined') {
                setDeleteMsg(`${ data.deletedPlayer }さんが離脱しました`);
                setShowDelete(true);
            }
        }
        /** socketのイベントハンドラ登録一覧 */
        props.socket.on('update_player_list', (data) => displayDelete(data));

    }, [ props.socket ]);

    return (
        <div className="deleteMsg" onAnimationEnd={ () => setShowDelete(false) } style={ { display: showDelete ? 'block' : 'none' } }>{ deleteMsg }</div>
    );
}