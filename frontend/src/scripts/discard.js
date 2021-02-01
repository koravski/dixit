import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Card from './card';
import '../css/discard.css';

/**
 * 墓地の表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function Discard(props) {

    /** 墓地の内容 */
    const [discard, setDiscard] = useState(null);
    /** 墓地の表示 */
    const [showDiscard, setShowDiscard] = useState(false);

    useEffect(() => {
        /**
         * 墓地の更新
         * @param {{ game: Game }} data 連想配列として，gameをもつ
         */
        const update_discard = (data) => {
            setShowDiscard(true);
            const discard_x = $(".game-core-wrapper").offset().left;
            const stock_x = $("#stock").offset().left;
            Array.from(document.getElementsByClassName('eachFieldContainer')).forEach(element => {
                var rotate = Math.random() * 20 - 10;
                var card_x = element.getBoundingClientRect().left;
                const animation = data.game.discard._array.length === 0 ? [
                    { opacity: 1.0 },
                    { transform: `translate(${discard_x - card_x}px)` },
                    { transform: `translate(${stock_x - card_x}px) rotate(${rotate}deg)`, opacity: 0.0 }
                ] : [
                    { opacity: 1.0 },
                    { transform: `translate(${discard_x - card_x}px) rotate(${rotate}deg)`, opacity: 0 }
                ];
                element.animate(animation, { duration: data.game.discard._array.length === 0 ? 2000 : 1000 });
            });
            setTimeout(() => {
                setDiscard(
                    data.game.discard._array.map((card, index) => {
                        var id_btn = 'eachDiscardButton' + index;
                        var id_img = 'eachDiscardImage' + index;
                        var field_src = "../images/" + card.filename;
                        var rotate = Math.random() * 20 - 10;
                        var shiftX = Math.random() * 10 - 5;
                        var shiftY = Math.random() * 10 - 5;
                        const style = { transform: `rotate(${rotate}deg) translate(${shiftX}px, ${shiftY}px)` };
                        const discardButton = (
                            <p className='eachDiscardButton' id={ id_btn } type='button' key={ index }>
                                <img className='eachDiscardImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                            </p>
                        );
                        return (<Card button={ discardButton } style={ style } kind={ "Discard" }/>)
                    })
                )
            }, data.game.discard._array.length === 0 ? 2000 : 1000);
        };
        /**
         * 墓地の表示
         * @param {{ game: Game }} data 連想配列として，gameをもつ
         */
        const show_discard = (data) => {
            setShowDiscard(true);
            setTimeout(() => {
                setDiscard(
                    data.game.discard._array.map((card, index) => {
                        var id_btn = 'eachDiscardButton' + index;
                        var id_img = 'eachDiscardImage' + index;
                        var field_src = "../images/" + card.filename;
                        var rotate = Math.random() * 20 - 10;
                        var shiftX = Math.random() * 10 - 5;
                        var shiftY = Math.random() * 10 - 5;
                        const style = { transform: `rotate(${rotate}deg) translate(${shiftX}px, ${shiftY}px)` };
                        const discardButton = (
                            <p className='eachDiscardButton' id={ id_btn } type='button' key={ index }>
                                <img className='eachDiscardImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                            </p>
                        );
                        return (<Card button={ discardButton } style={ style } kind={ "Discard" }/>)
                    })
                )
            }, data.game.discard._array.length === 0 ? 2000 : 1000);
        };
        
        // socketのイベントハンドラ登録一覧
        props.socket.on('room', () => setShowDiscard(false));
        props.socket.on('hand_selection', (data) => update_discard(data));
        props.socket.on('others_hand_selection', (data) => show_discard(data));
        props.socket.on('field_selection', (data) => show_discard(data));
        props.socket.on('show_answer', (data) => show_discard(data));
        props.socket.on('restart', () => setShowDiscard(false));

    }, [ props.socket ]);

    return(<div id="discard" className="discard" style={ { display: showDiscard ? 'block' : 'none' } }>{ discard }</div>)
}