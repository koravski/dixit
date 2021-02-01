'use strict';

/** 墓地クラス */
class Discard {

    /** 墓地のコンストラクタ */
    constructor() {
        this._array = new Array();
    }

    /**
     * 墓地にカードを一枚追加
     * @param {Card} cards カード
     */
    push(cards) {
        this._array.push(cards);
    }

    /** 墓地から一枚カードを削除し取得 */
    pop() {
        return this._array.pop();
    }
}

module.exports = Discard;