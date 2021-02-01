import React, {useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faComment } from '@fortawesome/free-solid-svg-icons';
import '../css/chat.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * チャットの表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function Chat(props) {
    /** メッセージフォーム */
    const { register, handleSubmit, reset } = useForm();
    /** チャットログ */
    const [chatLog, appendMsg] = useState([]);
    /** チャットログの参照 */
    const chatLogElement = useRef();
    /** チャットフォームの参照 */
    const chatFormElement = useRef();
    /** チャットの表示 */
    const [showChat, setShowChat] = useState(false);

    /**
     * メッセージを送信したときの動作
     * @param {{ msg: string }} data 連想配列として，msgをもつ
     * @param {Event} event イベント
     */
    const onSubmit = (data, event) => {
        if (data.msg === '') return;
        props.socket.emit('chat_send_from_client', {value : data.msg});
        reset();
        event.preventDefault();
    }

    useEffect(() => {
        // socketのイベントハンドラ登録一覧
        props.socket.on('chat_send_from_server', (data) => { // サーバからのチャット更新
            const time = new Date();
            appendMsg((prev) => [...prev, { name: data.name, msg: data.value, time: format(time), self: props.socket.id === data.socketId }]);
            chatLogElement.current.scrollTop = chatLogElement.current.scrollHeight;
        });
        props.socket.on('room', () => setShowChat(false));
        props.socket.on('update_player_list', () => setShowChat(true));
        props.socket.on('in_room', () => setShowChat(true));
        props.socket.on('hand_selection', () => setShowChat(true));
        props.socket.on('others_hand_selection', () => setShowChat(true));
        props.socket.on('field_selection', () => setShowChat(true));
        props.socket.on('show_answer', () => setShowChat(true));
        props.socket.on('result', () => setShowChat(true));

    }, [ props.socket ]);

    return (
        <div className='chat-form-wrapper' style={ {display: showChat ? 'block' : 'none'} }>
            <div className="chat-header">
                <h4><span className="chat-icon"><FontAwesomeIcon icon={ faComment }/></span> チャット</h4>
            </div>
            <div className="chat-log-wrapper">
                <div id="chatLog" ref={ chatLogElement }>
                    { chatLog.map((data, index) => 
                        data.self ? (
                            <div className="outgoing-chats" key={ 'message' + index }>
                                <div className="outgoing-msg">
                                    <div className="outgoing-chats-msg">
                                        <div className="outgoing-msg-inbox">
                                            <p>{ data.msg }</p>
                                            <span className="time">{ data.time }</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="received-chats" key={ 'message' + index }>
                                <div className="received-chats-name">
                                    { data.name }
                                </div>
                                <div className="received-msg">
                                    <div className="received-chats-msg">
                                        <div className="received-msg-inbox">
                                            <p>{ data.msg }</p>
                                            <span className="time">{ data.time }</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) }
                </div>
            </div>
            <div className="chat-bottom">
                <div className="input-msg-group">
                    <form className="form-inline chat-form-content" id="chatForm" ref={ chatFormElement } onSubmit={ handleSubmit(onSubmit) }>
                        <div className="message-wrapper">
                        <input type="text" className="form-control chat-input" id="message" name="msg" ref={ register() } placeholder="メッセージ"/>
                        <div className="input-msg-group-append">
                            <span onClick={ handleSubmit(onSubmit) } form="chatForm" className="input-msg-group-text">
                                <FontAwesomeIcon className="send-icon" icon={ faPaperPlane }/>
                            </span>
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/**
 * チャット入力時の日時をフォーマット
 * @param {Date} time 入力日時
 * @return HH:MM:{AM, PM} | MM DD
 */
function format(time) {
    const month = monthNames[time.getMonth()];
    const date = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour %= 12;
    hour = hour ? hour : 12;
    minute = minute < 10 ? '0' + minute : minute;
    return hour + ':' + minute + ' ' + ampm + ' | ' + month + ' ' + date;
}