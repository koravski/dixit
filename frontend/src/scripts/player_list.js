import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessRook, faChessPawn } from "@fortawesome/free-solid-svg-icons";
import '../css/player_list.css';

/**
 * プレイヤーリストの表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function PlayerList(props) {
    /** プレイヤーリストの表示 */
    const [showPlayerList, setShowPlayerList] = useState(true);
    /** プレイヤーリストの内容 */
    const [playerList, setPlayerList] = useState(null);

    useEffect(() => {
        /**
         * プレイヤーリストの更新
         * @param {Player[]} players プレイヤーの配列
         */
        const updatePlayerList = (players) => {
            setShowPlayerList(true);
            setPlayerList(
                players.sort((a, b) => {
                    if( a.score > b.score ) return -1;
                    if( a.score < b.score ) return 1;
                    return 0;
                }).map((player, index) => {
                    const ret = (player.socketId === props.socket.id) ? ( //自分かどうか
                            <tr className="self-status" key={ index }>
                                <td className="status-icon">
                                    <div className="status-rank">{ index + 1 }</div>
                                    <FontAwesomeIcon className={ player.isMaster?"icon-master":"icon-other"} icon={ player.isMaster ? faChessRook : faChessPawn }/>
                                </td>
                                <td><div className="status-name">{ player.name }</div></td>
                                <td><div className="status-score">{ player.score }</div></td>
                            </tr>
                    ) : (
                            <tr className="other-status" key={ index }>
                                <td className="status-icon">
                                    <div className="status-rank">{ index + 1 }</div>
                                    <FontAwesomeIcon className={ player.isMaster?"icon-master":"icon-other"} icon={ player.isMaster ? faChessRook : faChessPawn }/>
                                </td>
                                <td><div className="status-name">{ player.name }</div></td>
                                <td><div className="status-score">{ player.score }</div></td>
                            </tr>
                    )
                    return(ret);
                })
            );
        };

        // socketのイベントハンドラ登録一覧
        props.socket.on('update_player_list', (data) => updatePlayerList(data.game.players));
        props.socket.on('room', () => setShowPlayerList(false));
        props.socket.on('in_room', (data) => updatePlayerList(data.game.players));
        props.socket.on('hand_selection', (data) => updatePlayerList(data.game.players));
        props.socket.on('others_hand_selection', (data) => updatePlayerList(data.game.players));
        props.socket.on('field_selection', (data) => updatePlayerList(data.game.players));
        props.socket.on('show_answer', (data) => updatePlayerList(data.game.players));
        props.socket.on('result', (data) => updatePlayerList(data.game.players));
        props.socket.on('restart', (data) => updatePlayerList(data.game.players));

    }, [ props.socket ]);

    return (
        <div className="player-list" style={ { display: showPlayerList ? 'block' : 'none' } }>
            <div className="white kck"  style={ { display: playerList!=null ? 'block' : 'none' } } >Players</div>
            <table className="table">
                { playerList }
            </table>   
        </div>
    );
}