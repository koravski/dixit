import React, {useState, useEffect} from 'react';

/**
 * 現在サイト内でプレイしている全員の人数表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function PlayerCounter(props) {
    /** 現在のプレイヤー人数 */
    const [player_num, setPlayerNum] = useState(0);

    useEffect(() => {
        // socketのイベントハンドラ登録一覧
        props.socket.on('update_number_of_player', (data) => setPlayerNum(data.num)); // 人数表示更新

    }, [ props.socket ]);

    return (
        <div id="numOfPeople">現在のプレイヤー人数：{ player_num }人</div>
    );
}