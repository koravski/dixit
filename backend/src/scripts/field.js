'use strict';

const utils = require('./utils');

class Field {

    /** フィールドのコンストラクタ */
    constructor() {
        this.cards = new Array();
        this.masterCard = null;
        this.masterCardIndex = 0;
    }

    /**
     * フィールドにカードを追加
     * @param {Card} card カード
     * @param {Game} game ゲーム
     */
    add(card, game) {
        card.nextStatus();
        if(game.findPlayer(card.player).isMaster){
            this.masterCard = card;
        }
        this.cards.push(card);
    }

    /** フィールドからカードを削除 */
    pop() {
        return this.cards.pop();
    }

    /** フィールドのカードをシャッフル */
    shuffle() {
        this.cards = utils.shuffle(this.cards);
        this.updateMasterCardIndex();
    }

    /** 
     * フィールドの内の正解のカードのインデックスを更新.
     * 主にシャッフルが終わった後に行う．
     */
    updateMasterCardIndex(){
        this.masterCardIndex = this.cards.indexOf(this.masterCard);
    }
}

module.exports = Field;