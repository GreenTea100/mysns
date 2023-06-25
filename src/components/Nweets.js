import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import { deleteObject,ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const NweetTextRef = doc(dbService,"nweets",`${nweetObj.id}`);
    const desertRef = ref(storageService, nweetObj.attachmentUrl);
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok){
            //delete
            await deleteDoc(NweetTextRef);
            if (nweetObj.attachmentUrl !== ""){
                await deleteObject(desertRef);
            }
            
        }
    };

    var date = new Date(nweetObj.createAt);//타임스탬프를 인자로 받아 Date 객체 생성

    /* 생성한 Date 객체에서 년, 월, 일, 시, 분을 각각 문자열 곧바로 추출 */
    var year = date.getFullYear().toString().slice(-2); //년도 뒤에 두자리
    var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
    var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
    var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
    var second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)

    var returnDate = year + "년" + month + "월" + day + "일 " + hour + "시" + minute + "분";


    const toggleEditng = () =>setEditing((prev) => !prev);
    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef,{
            text: newNweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewNweet(value);
    };
    return (
    <div className="nweet">
        {editing ? (
            <>
            <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                    type="text"
                    placeholder="Edit"
                    defaultValue={newNweet}
                    required
                    autoFocus
                    onChange={onChange}
                    className="formInput"
                    />
                    <input type="submit" value="업데이트" className="formBtn"/>
            </form>
            <span onClick={toggleEditng} className="formBtn cancelBtn">
                취소
            </span>
            
            </>
        ) : (
            <>
            <h4>닉네임 {returnDate}</h4>
            <h4>'</h4>
            <h4>{nweetObj.text}</h4>
             



            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl}/>}
            {isOwner && (
                <div className="nweet__actions">
                    <span onClick={toggleEditng}>
                        <FontAwesomeIcon icon={faPencilAlt}/>
                    </span>
                    <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </span>
                    
                </div>
        )}
            </>
        )}
    </div>
)
};
export default Nweet;