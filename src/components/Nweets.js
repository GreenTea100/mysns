import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import { deleteObject,ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const [newD, setD] = useState(nweetObj.createAt);
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
             <h4>{nweetObj.text}</h4>
    
             <h4>{nweetObj.createAt}</h4>


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