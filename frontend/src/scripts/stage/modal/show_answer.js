import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import Card from '../../card';
import '../../../css/show_answer.css';

/** ボタンの効果音 */
const audio = new Audio('../audio/decision29low.wav');
/** ボタンの効果音の音量 */
audio.volume = 0.1;
/** プレイヤーの色 */
const playerColors = [ 
    { 'background-color': '#2ed573' }, 
    { 'background-color': '#00BFFF' }, 
    { 'background-color': '#ffa502' }, 
    { 'background-color': '#ff3838' }, 
    { 'background-color': '#ff6348' },
    { 'background-color': '#a55eea' }
];

/**
 * 投票結果とスコア変化(show_answer)のモーダルの表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function ShowAnswer(props) {
    /** モーダルのタイトル */
    const [message, setMessage] = useState(null);
    /** 全プレイヤーのスコア変化 */
    const [scoreDiffs, setScoreDiffs] = useState(null);
    /** フィールドの表示 */
    const [fieldCards, setFieldCards] = useState(false);
    /** フィールドを選んだプレイヤーの表示内容 */
    const [selectedNames, setSelectedNames] = useState(null);
    /** フィールドを選んだプレイヤーの表示内容 */
    const [ownerNames, setOwnerNames] = useState(null);
    /** フィールドを選んだプレイヤーの表示の最大値 */
    const [maxHeight, setMaxHeight] = useState(null);


    useEffect(() => {
        /** アイコンのスタイル */
        const iconStyle =  { 'margin-right': 20,'margin-left': 20 };

        // モーダルの表示の中心をbodyではなく.game-coreに変更
        $('#answerModal').on('shown.bs.modal', () => {
            $('body').removeClass('modal-open');
            $('.game-core').addClass('modal-open');
        });
        $('#answerModal').on('hidden.bs.modal', () => {
            audio.play();
            console.log('答えのモーダル閉じました');
            $('.game-core').removeClass('modal-open');
            props.socket.emit('confirm_answer');
        });

        /**
         * モーダルの表示
         * @param {{ game: Game, player: Player }} data 連想配列として，game, playerをもつ
         */
        const open_modal = (data) => {
            // スコア変化の表示セット
            setScoreDiffs(
                data.game.players.sort((a, b) => { // 降順ソート
                    if( a.score > b.score ) return -1;
                    if( a.score < b.score ) return 1;
                    return 0;
                }).map((player, index) => {
                    var id_score_diff = 'eachScoreDiff' + index;
                    return(
                        <div className='eachScoreDiff' id={ id_score_diff } key={ index }>
                            <span className="score-diff-name" style={ playerColors[data.game.players.indexOf(player)] }>{ player.name }</span>
                            <span>{ player.prescore }</span>
                            <FontAwesomeIcon className="role-figure" style={ iconStyle }  icon={ faLongArrowAltRight }/>
                            <span>{ player.score }</span>
                        </div>
                    );
                })
            );
            // フィールド上のカードが誰のカードだったのかの表示セット
            setOwnerNames(
                data.game.field.cards.map((card, index) => {
                    var id_lst = 'eachOwnerNames' + index;
                    const name = data.game.players.filter(player => 
                            player.socketId === card.player
                    ).map((player, indexplayer) => {
                        const id = "eachName" + index + "player" + indexplayer;
                        const eachName = <div className={player.isMaster ? "eachOwnerName master" : "eachOwnerName"} style={ playerColors[data.game.players.indexOf(player)] } id={ id }>{ player.name }</div>;
                        const ret = player.isMaster ? [eachName, <div className="eachOwnerName correct" key={ index }>Correct</div>] : eachName;
                        return (ret);
                    });
                    return (<div className="eachOwnerNames" id={ id_lst }>{ name }</div>);
                })
            );
            // 高さの設定
            setMaxHeight(
                Math.max(
                    ...[3, 
                        ...data.game.field.cards.map(
                            card => data.game.players.filter(player => player.socketId === card.player).length)
                        ]
                )
            );
            // 投票結果のフィールドの表示セット
            setFieldCards(
                data.game.field.cards.map((card, index) => {
                    var id_btn = 'eachFieldButton' + index;
                    var id_img = 'eachFieldImage' + index;
                    var field_src = "../images/" + card.filename;
                    const fieldButton = (
                        <p className='eachSelectedFieldButton' id={ id_btn } key={ index }>
                            <img className='eachSelectedFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ fieldButton } kind={ 'answer' } isMaster={ index === data.game.field.masterCardIndex ? true : false }/>);
                })
            );
            // 投票結果の表示セット
            setSelectedNames(
                data.game.field.cards.map((card, index) => {
                    var id_lst = 'eachSelectedNames' + index;
                    const names = data.game.players.filter(player => 
                        data.game.answers.filter(element => element.cardIndex === index).some(element => element.id === player.socketId)
                    ).map((player, indexplayer) => {
                        const id = "eachName" + index + "player" + indexplayer;
                        return (<div className="eachName" id={ id } key={ indexplayer } style={ playerColors[data.game.players.indexOf(player)] }>{ player.name }</div>);
                    });
                    return (<div className="eachSelectedNames" id={ id_lst } key={ index }>{ names }</div>);
                })
            );
            setMessage( data.player.score - data.player.prescore === 0 ? 'Sorry!' : 'You did it!' );
            if(data.player.state === 'undone'){
                $('#answerModal').modal('toggle');
            }
        };

        /** サーバからのemitされたときのイベントハンドラ一覧 */
        props.socket.on('show_answer', (data) => open_modal(data));
        props.socket.on('in_room', () => {
            if ($('#answerModal').is(':visible')) {
                $('#answerModal').modal('toggle');
            }
        });

    }, [ props.socket ]);

    /** モーダルを閉じるボタンをクリックしたときのハンドラ */
    const handleclick = () => {
        $('#answerModal').modal('toggle');
    };

    return (
        <div className="modal fade" id="answerModal" tabIndex="-1" role="dialog" aria-labelledby="answerModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="answerModalTitle">Result</h5>
                        <button type="button" className="close" onClick={ handleclick } aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='answer-wrapper' id="answer">
                            { message }
                            <div className="show-answer-selected-cards">
                                <div className="field-result-wrapper">
                                    <p></p>
                                    <div id="owner-field" style={ { 'height': `${ maxHeight * 10 }px` } }>{ ownerNames }</div>
                                    <div className="field-cards-result">{ fieldCards }</div>
                                    <div id="selected-field">{ selectedNames }</div>
                                </div>
                            </div>
                            <div className="score-diff">
                                { scoreDiffs }
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button id="backButton" onClick={ handleclick } type="button" className="btn btn-warning m-auto">OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
}