// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import Card from '../card';
import '../../css/hand_selection.css';

/** ボタンの効果音 */
const audio = new Audio("../audio/draw.mp3");
/** ボタンの効果音の音量 */
audio.volume = 0.3;

/**
 * 手札の表示
 * @param {{ socket: SocketIO.Socket, setMessage: (message: string) => void, setMasterIndex: (masterIndex: number) => void, setSrc: (src: JSX.Element) => void }} props 連想配列として，socket, setMassage, setMasterIndex, setSrcをもつ
 */
export default function HandSelection(props) {
    /** 手札を表示するか否か */
    const [showhand, setShowHand] = useState(false);
    /** 手札の内容 */
    const [hand_buttons, setHandButtons] = useState(null);

    useEffect(() => {
        /**
         * 手札の表示(ドロー時)
         * @param {{ game: Game, player: Player }} data 連想配列として，game, playerをもつ
         */
        const draw_card = (data) => {
            setShowHand(true);
            setHandButtons(
                data.player.hand._array.slice(0, 5).map((card, index) => {
                    const id_btn = `eachHandButton${ index }`;
                    const id_img = `eachHandImage${ index }`;
                    const hand_src = `../images/${ card.filename }`;
                    const handButton = data.player.isMaster ? (
                        <p className='eachHandButton' id={ id_btn } type='button' key={ index } onClick={ () => master_select(data, index) } data-toggle="modal" data-target="#exampleModalCenter">
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p> 
                    ) : (
                        <p className='eachHandButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return(<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );


            setTimeout(() => {
                hand_selection(data);
            }, data.game.discard._array.length === 0 ? 3000 : 1000);
        };

        /**
         * 手札の表示
         * @param {{ game: Game, player: Player }} data 連想配列として，game, playerをもつ
         */
        const hand_selection = (data) => {

            setHandButtons(
                data.player.hand._array.map((card, index) => {
                    const id_btn = `eachHandButton${ index }`;
                    const id_img = `eachHandImage${ index }`;
                    const hand_src = `../images/${ card.filename }`;
                    const handButton = data.player.isMaster ? (
                        <p className='eachHandButton' id={ id_btn } type='button' key={ index } onClick={ () => master_select(data, index) } data-toggle="modal" data-target="#exampleModalCenter">
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p> 
                    ) : (
                        <p className='eachHandButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return(<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );

            if(data.player.isMaster){ //語り部の場合
                props.setMessage('あなたは親です(ﾟ∀ﾟ)カードを選択してください(=^▽^)σ');
            } else { // 語り部以外のプレイヤーの場合
                props.setMessage('あなたは子です(ﾟ∀ﾟ)待機中( ´Д`)y━･~~');
            }
        };
        /**
         * 語り部が手札からカードを選択したときの動作
         * @param {{ game: Game, player: Player }} data 連想配列として，game, playerをもつ
         * @param {number} index 語り部が選んだカードの手札上のインデックス
         */
        const master_select = (data, index) => {
            if(data.player.isMaster){
                props.setMasterIndex(index);
                story_selection(data, index);
            }else{
                //TODO:子の表示
            }
        };
        /**
         * 語り部が手札から選んだカードの表示と手札の非表示及びお題フォームの表示
         * @param {{ game: Game, player: Player }} data 連想配列として，game, playerをもつ
         * @param {number} index 語り部が選んだカードの手札上のインデックス
         */
        const story_selection = (data, index) => {
            props.setMessage('あなたは親です(ﾟ∀ﾟ)カードのお題を入力してください⊂((・x・))⊃');
            const selectedSrc = `../images/${ data.player.hand._array[index].filename }`;
            props.setSrc(
                <p className="selectedButton" id="selected-hand-card-wrapper" key={ index }>
                    <img className="selectedImage" src={ selectedSrc } alt="あなたが選んだカード"/> 
                </p>
            );
        };
        /**
         * 語り部以外のプレイヤーの手札の表示
         * @param {{ game: Game, player: Player }} data 連想配列として，game, playerをもつ
         */
        const others_hand_selection = (data) => {
            setShowHand(true);
            if (data.player.isMaster) {
                props.setMessage('あなたは親です(ﾟ∀ﾟ)待機中( ´Д`)y━･~~');
                update_hand(data.player);
                props.socket.emit('wait');
            } else {
                props.setMessage('あなたは子です(ﾟ∀ﾟ)お題に沿ったカードを選択してください(=^▽^)σ');
                setHandButtons(
                    data.player.hand._array.map((card, index) => {
                        const id_btn = `eachHandButton${ index }`;
                        const id_img = `eachHandImage${ index }`;
                        const hand_src = `../images/${ card.filename }`;
                        const handButton = (
                            <p className='eachHandButton' id={ id_btn } type='button' key={ index } onClick={ () => others_select(props.socket, data, index) }>
                                <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                            </p>
                        );
                        return (<Card button={ handButton } kind={ 'Hand' }/>);
                    })
                );
            }
        };
        /**
         * 語り部以外のプレイヤーが手札からカードを選んだときの動作
         * @param {SocketIO.Socket} socket socket
         * @param {{ player: Player }} data 連想配列として，playerをもつ
         * @param {number} index 選んだカードの手札上のインデックス
         */
        const others_select = (socket, data, index) => {
            $(".toField").removeClass("toField");
            $(`#eachHandButton${ index }`).addClass("toField");
            const card_x = $(`#eachHandButton${ index }`).offset().left;
            const field_x = ($(`#eachHandButton${ 2 }`).offset().left + $(`#eachHandButton${ 3 }`).offset().left) / 2;
            const card_y = $(`#eachHandButton${ index }`).offset().top;
            const field_y = $(".eachFieldContainer").offset().top;
            document.getElementsByClassName("toField")[0].animate([
                // keyframes
                { transform: 'translateY(0px)'}, 
                { transform: `translate(${ field_x - card_x }px, ${ field_y - card_y }px)`, opacity: 0 }
              ], { 
                // timing options
                duration: 800
            });
            props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
            const selectedSrc = `../images/${ data.player.hand._array[index].filename }`;
            props.setSrc(
                <p className="selected-handcard-wrapper" id="selected-hand-card-wrapper">
                    <img id="selected-hand-card" src={ selectedSrc } alt="あなたが選んだカード"/> 
                </p>
            );
            // audio.play() // 再生
            setTimeout(
                () => socket.emit('others_hand_selection', { index : index }),
                800
            );

            // 直後にカードを押せなくする
            setHandButtons(
                data.player.hand._array.map((card, index) => {
                    const id_btn = `eachHandButton${ index }`;
                    const id_img = `eachHandImage${ index }`;
                    const hand_src = `../images/${ card.filename }`;
                    const handButton = (
                        <p className='eachHandButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );
        };
        /**
         * 手札の更新
         * @param {Player} player プレイヤー
         */
        const update_hand = (player) => {
            setShowHand(true);
            setHandButtons(
                player.hand._array.map((card, index) => {
                    const id_btn = `eachHandButton${ index }`;
                    const id_img = `eachHandImage${ index }`;
                    const hand_src = `../images/${ card.filename }`;
                    const handButton = (
                        <p className='eachHandButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );
        };


        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('update_hand', (data) => update_hand(data.player));
        props.socket.on('hand_selection', (data) => draw_card(data));
        props.socket.on('confirm_story_selection', (data) => update_hand(data.player));
        props.socket.on('others_hand_selection', (data) => others_hand_selection(data));
        props.socket.on('field_selection', (data) => update_hand(data.player));
        props.socket.on('show_answer', (data) => update_hand(data.player));
        props.socket.on('result', (data) => update_hand(data.player));
        props.socket.on('restart', () => setShowHand(false));
        props.socket.on('room', () => setShowHand(false));
        props.socket.on('in_room', () => setShowHand(false));

    }, [ props.socket ]);

    return (
        <div className="hand-wrapper" style={ { display: showhand ? 'block' : 'none' } }>
            <div>Your cards</div>
            <div className="hand-content">
                <div id="hand">{ hand_buttons }</div>
            </div>
        </div>
    );
}