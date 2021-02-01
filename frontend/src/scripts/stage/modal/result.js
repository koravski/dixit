import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import '../../../css/result.css';
import Leave from '../../leave';

/** ランキングの数字 */
const rank = ["1", "2", "3", "4", "5", "6"];
/** ランキングのsuffix */
const rank_suffix = ["st", "nd", "rd", "th", "th", "th"];
/** アイコンのスタイル */
const iconStyle = [ { 'color': 'gold' }, { 'color': 'blue' }, { 'color': 'chocolate' } ];
/** ボタンの効果音 */
const audio = new Audio('../audio/decision29low.wav');
/** ボタンの効果音の音量 */
audio.volume = 0.1;

/**
 * リザルト画面の表示
 * @param {{ socket: SocketIO.Socket, setMassage: (message: string) => void }} props 連想配列として，socket, setAMassageをもつ
 */
export default function Result(props) {
    /** 結果の内容 */
    const [result, setResult] = useState(null);

    const modalRef = useRef($('#resultModalWindow'));

    useEffect(() => {
        // モーダルの表示の中心をbodyではなく.game-coreに変更
        $('#resultModalWindow').on('shown.bs.modal', () => {
            $('body').removeClass('modal-open');
            $('.game-core').addClass('modal-open');
        });
        $('#resultModalWindow').on('hidden.bs.modal', () => {
            audio.play();
            $('.game-core').removeClass('modal-open');
            console.log('リザルトモーダル閉じました');
            props.socket.emit('restart');
        });

        /** result画面の表示 */
        const show_result = (data) => {
            props.setMessage('結果発表ですわぁ(⌒,_ゝ⌒)');
            let rank_index = -1;
            let pre_score = -1;
            setResult(
                data.game.players.sort((a, b) => { // 降順ソート
                    if( a.score > b.score ) return -1;
                    if( a.score < b.score ) return 1;
                    return 0;
                }).map((player, index) => {
                    if(player.score !== pre_score){ // 同点は同じ順位にする
                        rank_index = index;
                    }
                    pre_score = player.score;
                    const id_result = 'eachResult' + rank_index;
                    const icon = rank_index < 3 ? <FontAwesomeIcon style={ iconStyle[rank_index] }  icon={ faMedal }/> : null; 
                    return(
                        <tr className='eachResult' id={ id_result } key={ index }>
                            <td className="eachResultIcon">{ icon }</td>
                            <td className="eachResultRank">{ rank[rank_index] }</td>
                            <td className="eachResultRank">{ rank_suffix[rank_index] }</td>
                            <td className="eachResultName">{ player.name }</td>
                            <td className="eachResutScore">{ player.score }</td>
                        </tr>
                    );
                })
            );
            $('#resultModalWindow').modal('toggle');
        }

        // socketのインベントハンドラ登録一覧
        props.socket.on('in_room', () => {
            if ($('#resultModalWindow').is(':visible')) {
                $('#resultModalWindow').modal('toggle');
            }
        });
        props.socket.on('result', (data) => show_result(data));

    }, [ props.socket ]);

    const handleclick = () => {
        $('#resultModalWindow').modal('toggle');
    }

    return(
        <div className="modal fade" id="resultModalWindow" tabIndex="-1" role="dialog" aria-labelledby="resultModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" id="resultModalDialog" role="document">
                <div className="modal-content result-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="resultModalTitle">結果</h5>
                        <button type="button" className="close" onClick={ handleclick } aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <table id="result-table">
                            <tbody id="result">
                                <tr className='eachResult'>
                                    <td colSpan="3">順位</td>
                                    <td>プレイヤー名</td>
                                    <td>スコア</td>
                                </tr>
                                { result }
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button id="backButton" onClick={ handleclick } type="button" className="btn btn-warning m-auto">もう一度</button>
                        <Leave socket= { props.socket } handle={ handleclick } className="result-leave m-auto"/>
                    </div>
                </div>
            </div>
        </div>
    );
}