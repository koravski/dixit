import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessPawn, faChessRook } from "@fortawesome/free-solid-svg-icons";
import '../../css/show_role.css';

/**
 * 役割(語り部か聞き手)の表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function ShowRole(props) {
    /** ロールを表示するか否か */
    const [showrole, setShowRole] = useState(false);
    /** プレイヤーのロール */
    const [isMaster, setIsMaster] = useState(null);
    /** アイコンのスタイル */
    const iconStyle =  { 'width': 60, 'height': 60 };

    useEffect(() => {
        /**
         * スコアの表示
         * @param {{ player: Player }} data 連想配列として，playerをもつ
         */
        const show_role = (data) => {
            if (data.player.isMaster) {
                setIsMaster(true);
            } else {
                setIsMaster(false);
            }
            setShowRole(true);
        }
        /** スコアの表示リセット */
        const reset_role = () => {
            setShowRole(false);
        }
        /** サーバからemitされたときのイベントハンドラ一覧 */
        props.socket.on('room', () => setShowRole(false));
        props.socket.on('in_room', () => setShowRole(false));
        props.socket.on('hand_selection', (data) => show_role(data));
        props.socket.on('others_hand_selection', (data) => show_role(data));
        props.socket.on('field_selection', (data) => show_role(data));
        props.socket.on('show_answer', (data) => show_role(data));
        props.socket.on('result', (data) => show_role(data));
        props.socket.on('restart', () => reset_role());

    }, [ props.socket ]);

    return (
        <div className="role-wrapper" style={ { textAlign: "center", display: showrole ? 'block' : 'none', padding: "50" } } >
            <div className="role-container">
                {/* <FontAwesomeIcon className="role-figure" style={ iconStyle }  icon={ isMaster ? faChessRook : faChessPawn } color={ isMaster ? "gold" : "seashell" }/> */}
                <span className="text">{ isMaster ? "You are the Storyteller" : "You are a  Listner" }</span>
            </div>
        </div>
    );
}