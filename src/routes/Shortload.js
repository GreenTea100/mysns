import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import { deleteObject,ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faHeart } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Shortload = ({isOwner, userObj, shortObj}) => {
    const [editing, setEditing] = useState(false);
    const [newShort, setNewShort] = useState(shortObj.text);
    const ShortTextRef = doc(dbService,"shorts",`${shortObj.id}`);
    const desertRef = ref(storageService, shortObj.attachmentUrl);
    let LikeNum = shortObj.likes;




    //쇼츠 삭제 버튼
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok){
            //delete
            await deleteDoc(ShortTextRef);
            if (shortObj.attachmentUrl !== ""){
                await deleteObject(desertRef);
            }
            //toast("삭제 완료!");
        }
    };

    var date = new Date(shortObj.createAt);//타임스탬프를 인자로 받아 Date 객체 생성

    /* 생성한 Date 객체에서 년, 월, 일, 시, 분을 각각 문자열 곧바로 추출 */
    var year = date.getFullYear(); //년도 2자리
    var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
    var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
    var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
   
    var returnDate = year-2000 + "." + month + "." + day + "   " + hour + ":" + minute;

    //쇼츠 수정 토글 버튼
    const toggleEditng = () =>setEditing((prev) => !prev);

    //쇼츠 수정 확인 버튼
    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(ShortTextRef,{
            text: newShort,
        });
        setEditing(false);
        //toast("수정 완료!");
        
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewShort(value);
    };

    //좋아요 버튼
    const onClickLikes = async (event) => {
        event.preventDefault();

        
        
        if(shortObj.TF){
            LikeNum += 1;
            await updateDoc(ShortTextRef,{
                likes: LikeNum,
                TF: false,
            });
            //toast('Like ♥');
        }else{
            LikeNum -= 1;
            await updateDoc(ShortTextRef,{
                likes: LikeNum,
                TF: true,
            });
            //toast('unLike :(');
        }     
    }

    
    return (
    <div className="container">
        <ToastContainer
                    position="left" // 알람 위치 지정
                    autoClose={2000} // 자동 off 시간
                    hideProgressBar={true} // 진행시간바 숨김
                    closeOnClick // 클릭으로 알람 닫기
                    rtl={false} // 알림 좌우 반전
                    //pauseOnFocusLoss // 화면을 벗어나면 알람 정지
                    draggable // 드래그 가능
                    //pauseOnHover // 마우스를 올리면 알람 정지
                    theme="light"
                    limit={3} // 알람 개수 제한
        />
        {editing ? (
            <>
            <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                    type="text"
                    placeholder="본문 내용"
                    defaultValue={newShort}
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
            <form className="short">
                <form className="short_row">
                    {<img src={shortObj.profileImg} style={{width:40, height:40, borderRadius:100}}/>}
                    <h2 style={{margin:10}}>{shortObj.displayname}</h2>
                </form>
                <br></br>
                <h3>{shortObj.text}</h3>
                {isOwner && (
                    <div className="nweet__actions">
                        <span onClick={toggleEditng}>
                            <FontAwesomeIcon icon={faPencilAlt}/>
                        </span>
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </span>    
                    </div>
                    )
                }
                <br></br>
                <video src={shortObj.attachmentUrl} className="short_video" controls loop/>
                <span onClick={onClickLikes} className="short_likes">
                    {shortObj.likes}
                    {shortObj.TF ? (
                        <FontAwesomeIcon icon={faHeart} style={{marginLeft:5,color:"black",cursor:"pointer"}}/>
                    ):(
                        <FontAwesomeIcon icon={faHeart} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
                    )}
                </span>
            </form>
        )}
        
    </div>
)
};
export default Shortload;