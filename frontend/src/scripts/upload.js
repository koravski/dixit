
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../css/upload.css';
/**
 * 画像ファイルのアップロード
 * @param {{ socket: SocketIOClient.Socket }} props 連想配列として，socketをもつ
 */
export default function Upload(props) {
    /** エントリーフォーム */
    const { register, handleSubmit, reset } = useForm();
    /** エントリーフォームの表示 */
    const [show, setShow] = useState(false);
    /** エントリーフォームの表示 */
    const [picture, setPicture] = useState(null);

    useEffect(() => {
        const update = (data) => {// setShow + setPicture
            // let path = '../images/default/';
            // const files = fs.readdirSync('../images/default/');
            // setPicture(
            //     files.map((file) => {
            //         return(<img src={path+file}/>);
            //     })
            // );
        };
        // socketのイベントハンドラ登録一覧
        props.socket.on('entry_player', (data) => {
            setShow(true);
            update(data);
        });
        props.socket.on('room', () => {
            setShow(false);
        });
        props.socket.on('in_room', (data) => {
            setShow(true);
            update(data);
        });
        props.socket.on('show_start', (data) => {
            setShow(true);
            update(data);
        });
        props.socket.on('hand_selection', () => setShow(false));
        props.socket.on('restart', () => {
            setShow(true);
        });

    }, [ props.socket ]);

    /** 
     * エントリーフォーム入力時の動作
     * @param {{ imageFile: Blob[] }} data 画像ファイルデータ
     * @param {Event} event イベント
     */
    const onSubmit = (data, event) => {
        // サーバーに'entry'を送信
        const reader = new FileReader();
        if (data.imageFile.length !== 0) {
            reader.readAsDataURL(data.imageFile[0]);
            reader.onload = () => {
                props.socket.emit('upload', { filename: data.imageFile[0].name, image : reader.result });
                reset();
            };
        }
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    };

    return (
        <div style={ {display: show ? 'block' : 'none' } }>
            <form className="form-inline" id="imageForm" onSubmit={ handleSubmit(onSubmit) } >
                <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                <input type="file" className="form-control mb-2 mr-sm-2" id="imageFile" name="imageFile" ref={ register() }/>
                <button type="submit" className="btn btn-primary mb-2">画像をアップロード</button>
            </form>
            <div className="my-picture">
                { picture }
            </div>
        </div>
    );
}