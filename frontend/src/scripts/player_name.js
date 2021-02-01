import React from 'react';

/**
 * プレイヤー名の表示
 * @param {{ name: string }} props 
 */
export default function PlayerName(props) {

    return (
        <div className="player-name">
            <div>NAME</div>
            <p>{ props.name }</p>
        </div>
    );
}