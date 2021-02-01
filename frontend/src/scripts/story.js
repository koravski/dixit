import React, { useEffect, useState } from 'react';
import '../css/story.css';

/**
 * お題の表示
 * @param {{ socket: SocketIOClient.Socket }} props 連想配列として，socketをもつ
 */
export default function Story(props) {
    /** お題の表示 */
    const [showStory, setShowStory] = useState(false);

    useEffect(() => {
        // socketのイベントハンドラ登録一覧
        props.socket.on('in_room', () => setShowStory(false));
        props.socket.on('hand_selection', () => setShowStory(false));
        props.socket.on('others_hand_selection', () => setShowStory(true));
        props.socket.on('field_selection', () =>  setShowStory(true));
        props.socket.on('show_answer', () =>  setShowStory(true));
        props.socket.on('result', () => setShowStory(false));

    }, [ props.socket ]);

    return (
        <div id="story" style={ {display: showStory ? 'block' : 'none'} }>
            <div className='story-title'>The Story</div>
            <p>{ props.story }</p>
        </div>
    );
}