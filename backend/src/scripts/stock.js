'use strict';

const utils = require('./utils');

/**
 * 山札のクラス
 */
class Stock {

    /** 山札のコンストラクタ */
    constructor() {
        this._array = new Array();
        //最後に選択されたカードのindex
        this.selectedIndex = null;
    }

    /** 山札にカードを一枚追加する */
    push(card) {
        this._array.push(card);
    }

    /** 山札からカードを一枚とる */
    pop() {
        if (this._array.length > 0) {
            let card = this._array.pop();
            return card;
        } 
        else {
            // 墓地回収
            return null;
        }
    }

    /** 山札のシャッフル */
    shuffle() {
        this._array = utils.shuffle(this._array);
    }
}

module.exports = Stock;