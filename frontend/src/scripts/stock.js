import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Card from './card';
import '../css/stock.css';

/**
 * 手札の表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function Stock(props) {
    /** 手札の内容 */
    const [stock, setStock] = useState(null);
    /** 手札の表示 */
    const [showStock, setShowStock] = useState(false);

    useEffect(() => {
        /**
         * 山札の表示と山札から手札へのアニメーション
         * @param {{ game: Game }} data 連想配列として，gameをもつ
         */
        const stock_animate = (data) => {
            setStock(
                data.game.stock._array.map((card, index) => {
                    var id_btn = 'eachStockButton' + index;
                    var id_img = 'eachStockImage' + index;
                    var field_src = "../images/back/" + card.tailfilename;
                    var rotate = Math.random() * 20 - 10;
                    var shiftX = Math.random() * 10 - 5;
                    var shiftY = Math.random() * 10 - 5;
                    const style = { transform: `rotate(${rotate}deg) translate(${shiftX}px, ${shiftY}px)` };
                    const stockButton = (
                        <p className='eachStockButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachStockImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ stockButton } style={ style } kind={ 'Stock' }/>);
                })
            );
            const len = data.game.stock._array.length - 1;
            document.getElementById(`eachStockButton${len}`).style.display = 'block';
            document.getElementById(`eachStockButton${len}`).animate([
                // keyframes
                { transform: 'translate(0px,0px)'}, 
                { transform: 'translate(-300px,300px)' , opacity: 0.5 }
            ], { 
                // timing options
                duration: 1000
            });
            setTimeout(() => {
                document.getElementById(`eachStockButton${len}`).style.display = 'none';
            }, 1000);
        };
        /**
         * 墓地から山札へのアニメーション
         * @param {{ game: Game }} data 連想配列として，gameをもつ
         */
        const stock_update = (data) => {
            var card_x = $("#discard").offset().left;
            setShowStock(true);
            if (data.game.discard._array.length === 0) {
                const stock_x = $("#stock").offset().left;
                setTimeout(() => {
                    Array.from(document.getElementsByClassName('eachDiscardContainer')).forEach(element => {
                        element.animate([
                            { opacity: 1.0, offset: 0.0 },
                            { transform: `translate(${stock_x - card_x}px)`, display: 'none', opacity: 0, offset: 1.0 }
                        ], { duration: 1000 });
                    });
                }, 1000);
                setTimeout(() => {
                    stock_animate(data);
                }, 2000);
            } else {
                stock_animate(data);
            }
        };
        /**
         * ストックの表示
         * @param {{ game: Game }} data 連想配列として，gameをもつ
         */
        const display_stock = (data) => {
            setStock(
                data.game.stock._array.map((card, index) => {
                    var id_btn = 'eachStockButton' + index;
                    var id_img = 'eachStockImage' + index;
                    var field_src = "../images/back/" + card.tailfilename;
                    var rotate = Math.random() * 20 - 10;
                    var shiftX = Math.random() * 10 - 5;
                    var shiftY = Math.random() * 10 - 5;
                    const style = { transform: `rotate(${rotate}deg) translate(${shiftX}px, ${shiftY}px)` };
                    const stockButton = (
                        <p className='eachStockButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachStockImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ stockButton } style={ style } kind={ 'Stock' }/>);
                })
            );
            setShowStock(true);
        };

        // socketのイベントハンドラ登録一覧
        props.socket.on('room', () => setShowStock(false));
        props.socket.on('in_room', () => setShowStock(false));
        props.socket.on('hand_selection', (data) => stock_update(data));
        props.socket.on('others_hand_selection', (data) => display_stock(data));
        props.socket.on('field_selection', (data) => display_stock(data));
        props.socket.on('show_answer', (data) => display_stock(data));
        props.socket.on('result' , (data) => display_stock(data));
        props.socket.on('restart', () => setShowStock(false));

    }, [ props.socket ]);

    return (
        <div id="stock" style={ { display: showStock ? 'inline-flex' : 'none' } }>{ stock }</div>
    );
}