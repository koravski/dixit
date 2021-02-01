'use strict'
// 手札クラス

const Card = require('./card');
const utils = require('./utils');

class Hand {
    constructor() {
        // 初期化(fill部分にnew Card()すると全て同一オブジェクトになるので一旦nullで埋める)
        this._array = new Array();
        
        //最後に選択されたカードのindex
        this.selectedIndex = null;
    }

    pop() {
        let card = this._array[this.selectedIndex];
        this._array.splice(this.selectedIndex, 1);
        return card
    }
    add(card) {
        this._array.push(card);
    }

    select(index) {
        this.selectedIndex = index;
    }

    selectedCard(){
        return this._array[selectedIndex];
    }
}

module.exports = Hand;