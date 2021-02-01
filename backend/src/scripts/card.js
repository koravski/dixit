'use strict';

// 静的プロパティ
/** カードの場所 */
const statusList = ['stack', 'hand', 'field', 'discard'];

/** カードクラス */
class Card {
    /** カードの幅 */
    static CARD_WIDTH = 100;
    /** カードの高さ */
    static CARD_HEIGHT = 150;

    /**
     * カードのコンストラクタ
     * @param {string} filename ファイル名
     */
    constructor(filename) {
        /** どこにあるか */
        this.status = statusList[0];
        /** カードの場所のインデックス */
        this.statusIndex = 0;
        /** 表面の画像ファイル名 */
        this.filename = filename;
        /** 裏面の画像ファイル名 */
        this.tailfilename = "card_back.png";
        /** 表かどうか */
        this.head = false; // 
        /** カードの持ち主が誰か(socketID) */
        this.player = null;
    }

    /** ステータス移行 */
    nextStatus() {
        this.statusIndex += 1;
        if(this.statusIndex === 4) {
            this.statusIndex = 0;
        }
        this.status = statusList[this.statusIndex];

    }
}

module.exports = Card;