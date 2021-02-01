import React, { useEffect } from 'react';
import PlayerName from './player_name';
import ShowScore from './stage/show_score';
import '../css/status.css';

/**
 * ステータス(プレイヤー名とスコア)の表示
 * @param {{ socket: SocketIO.Socket, setShowStatus: (showStatus: boolean) => void }} props 連想配列として，socketとsetShowStatusをもつ
 */
export default function Status(props) {

    useEffect(() => {
        // socketのイベントハンドラ登録一覧
        props.socket.on('room', () => props.setShowStatus(false));
        props.socket.on('in_room', () => props.setShowStatus(true));
        props.socket.on('overlap', () => props.setShowStatus(true));
        props.socket.on('hand_selection', () => props.setShowStatus(true));
        props.socket.on('others_hand_selection', () => props.setShowStatus(true));
        props.socket.on('field_selection', () => props.setShowStatus(true));
        props.socket.on('show_answer', () => props.setShowStatus(true));
        props.socket.on('result', () => props.setShowStatus(true));
        props.socket.on('restart', () => props.setShowStatus(true));

    }, [ props.socket ]);

    return (
        <div className="player-status" style={ {display: props.showStatus ? 'none' : 'none'} }>
            <div className="outer-border">
                <div className="mid-border">
                    <div className="inner-border">
                        {/* <img className="corner-decoration corner-left-top" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/> 
                        <img className="corner-decoration corner-right-top" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/>
                        <img className="corner-decoration corner-right-bottom" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/>
                        <img className="corner-decoration corner-left-bottom" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/> */}
                        <div className="player-status-container">
                            <PlayerName name={ props.name }/>
                            <ShowScore socket={ props.socket }/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}