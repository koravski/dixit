// field_selectionステージ

import React, { useEffect, useState } from 'react';
import '../../css/field_selection.css';
import Card from '../card';

/** ボタンの効果音 */
const audio = new Audio('../audio/decision29low.wav');
/** ボタンの効果音の音量 */
audio.volume = 0.1;

/**
 * フィールドの表示，更新
 * @param {{ socket: SocketIO.Socket, setMessage: (message: string) => void }} props 連想配列として，player, setMassageをもつ
 */
export default function FieldSelection(props) {

    /** フィールドを表示するか否か */
    const [showfield, setShowField] = useState(true);
    /** フィールド決定ボタン表示するか否か */
    const [showButton, setShowButton] = useState(false);
    /** フィールドの表示内容 */
    const [field_buttons, setFieldButtons] = useState(null);
    /** フィールドのラッパーの表示内容 */
    const [showfieldWrapper, setShowfieldWrapper] = useState(false);

    useEffect(() => {
        /** 初期化 */
        const initialize = () => {
            setTimeout(() => {
                setShowField(false);
            }, 1000);
            setShowfieldWrapper(true);
        };
        /**
         * フィールドの表示
         * @param {{ game: Game, player: Player }} data 連想配列として，game, playerをもつ
         */
        const field_selection = (data) => {
            setShowfieldWrapper(true);
            setFieldButtons(
                data.game.field.cards.map((card, index) => {
                    const id_btn = `eachFieldButton${ index }`;
                    const id_img = `eachFieldImage${ index }`;
                    const field_src = `../images/${ card.filename }`;
                    const fieldRadio = <input className="eachFieldRadio" name="field-cb" id={ `cb${ id_btn }` } type="radio" value={id_btn}></input>;
                    const fieldButton = card.player === props.socket.id ? (
                        <p className='eachFieldButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    ) : (
                        <p className='eachFieldButton' id={ id_btn } type='button' onClick={ () => selected(data, index, id_btn, field_src) }>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card radio={ fieldRadio } button={ fieldButton } kind={ 'Field' }/>);
                })
            );
            if (!data.player.isMaster) { // 語り部以外のプレイヤーの場合
                props.setMessage('あなたは子です(ﾟ∀ﾟ)親が出したと思うカードを選択してください(=^▽^)σ');
            } else { // 語り部の場合
                props.setMessage('あなたは親です(ﾟ∀ﾟ)子の選択を待ちましょう( ´Д`)y━･~~');
                props.socket.emit('wait');
            }
        };
        const selected = (data, index, id_btn) => {
            others_field_select(props.socket, data, index);
            document.getElementById(`cb${ id_btn }`).checked = !document.getElementById(`cb${ id_btn }`).checked;
        };
        /**
         * 語り部以外のプレイヤーがフィールド上のカードを選んだときの動作
         * @param {SocketIO.Socket} socket socket
         * @param {{ player: Player }} data 連想配列として，playerをもつ
         * @param {number} index 
         */
        const others_field_select = (socket, data, index) => {
            if (!data.player.isMaster) { // 語り部ではない
                props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
                socket.emit('field_selection', { index : index });
                setShowButton(true);
            }
        };
        /** フィールドの表示リセット */
        const field_reset = () => {
            setShowField(false);
            setShowfieldWrapper(false);
        };
        /**
         * フィールド上のカードを裏向きの状態で更新
         * @param {Game} game ゲーム
         */
        const update_field_with_back = (game) => {
            setShowField(true);
            setShowfieldWrapper(true);
            setFieldButtons(
                game.field.cards.map((card, index) => {
                    const id_btn = `eachFieldButton${ index }`;
                    const id_img = `eachFieldImage${ index }`;
                    const field_src = `../images/back/${ card.tailfilename }`;
                    const fieldButton = (
                        <p className='eachFieldButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ fieldButton } kind={ 'Field' }/>);
                })
            );
        };
        /**
         * フィールド上のカードを表向きの状態で更新
         * @param {Game} game ゲーム
         */
        const update_field_with_front = (game) => {
            setShowField(true);
            setShowfieldWrapper(true);
            setFieldButtons(
                game.field.cards.map((card, index) => {
                    const id_btn = `eachFieldButton${ index }`;
                    const id_img = `eachFieldImage${ index }`;
                    const field_src = `../images/${ card.filename }`;
                    const fieldButton = (
                        <p className='eachFieldButton' id={ id_btn } type='button' key={ index }>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ fieldButton } kind={ 'Field' }/>);
                })
            );
        };

        /** サーバーからのemitを受け取るイベントハンドラ登録一覧 */
        props.socket.on('in_room', () => setShowfieldWrapper(false));
        props.socket.on('hand_selection', () => initialize());
        props.socket.on('others_hand_selection', (data) => update_field_with_back(data.game));
        props.socket.on('field_selection', (data) => field_selection(data));
        props.socket.on('update_field_with_back', (data) => update_field_with_back(data.game));
        props.socket.on('show_answer', (data) => update_field_with_front(data.game));
        props.socket.on('result', () => field_reset());

    }, [ props.socket ]);

    const handleclick = () => {
        audio.play();
        props.socket.emit('confirm_field_selection');
        setShowButton(false);
    }

    return (
        <div className='field-wrapper' style={ { display: showfieldWrapper ? 'block' : 'none' } }>
            <div style={ { display: showfield ? 'inline-flex' : 'none' } }>Guess the card</div>
            <div id="field" style={ { display: showfield ? 'inline-flex' : 'none' } }>{ field_buttons }</div>
            <button onClick={ handleclick } type="button" className="btn btn-warning fieldSelectButton" style={ { display: showButton ? 'block' : 'none' } }>Select this one</button>
        </div>
    );
}