import React from 'react';
import '../css/card.css';

/**
 * カードの要素．この中にボタンがあり，ボタンの中に画像が埋め込まれている．
 * @param {{ radio: JSX.Element, button: JSX.Element, kind: string }} props 連想配列として，radio, button, kindをもつ
 */
export default function Card(props) {
    /** カードの種類．HandかFieldか */
    let className =  props.kind === 'answer' || props.kind === 'selected' ? `${ props.kind }Container` : `each${ props.kind }Container zoom-up-card`;
    if (props.kind === 'answer' && props.isMaster) {
        className += ' correctAnswer';
    }

    const isField = (props.kind === 'Field');
    const isAnswer = (props.kind === 'answer');
    const isDiscardOrStock = (props.kind === 'Discard' || props.kind === 'Stock');

    const resultComponent = isDiscardOrStock ? (
        <div className={ className } display='inline-flex' style={ props.style }>
            { props.button }
        </div>
    ) : isField ? (
        <div className={ className } display='inline-flex'>
            { props.radio }
            { props.button }
        </div>
    ) : isAnswer && props.isMaster ? (
        <div className={ className } display='inline-flex'>
            <div className="innnderAnswerContainer">
                { props.button }
            </div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    ) : (
        <div className={ className } display='inline-flex'>
            { props.button }
        </div>
    );

    return (
        resultComponent
    );
}