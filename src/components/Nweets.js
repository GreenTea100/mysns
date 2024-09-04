import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import { deleteObject,ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faHeart } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { async } from "@firebase/util";
import { Tag } from "@mui/icons-material";
import Modal from "react-modal";

const Nweet = ({nweetObj, isOwner, userObj}) => {
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const NweetTextRef = doc(dbService,"nweets",`${nweetObj.id}`);
    const desertRef = ref(storageService, nweetObj.attachmentUrl);
    const [modalIsOpen_edit, setModalIsOpen_edit] = useState(false);
    const [attachment, setAttachment] = useState("");

    let LikeNum = nweetObj.likes;
    

    let arr = nweetObj.Liker;
    


    //게시글 삭제 버튼
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok){
            //delete
            await deleteDoc(NweetTextRef);
            if (nweetObj.attachmentUrl !== ""){
                await deleteObject(desertRef);
            }
            toast('삭제 완료!');
        }
    };

    var date = new Date(nweetObj.createAt);//타임스탬프를 인자로 받아 Date 객체 생성

    /* 생성한 Date 객체에서 년, 월, 일, 시, 분을 각각 문자열 곧바로 추출 */
    var year = date.getFullYear(); //년도 2자리
    var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
    var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
    var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
   
    var returnDate = year-2000 + "." + month + "." + day + "   " + hour + ":" + minute;

    //게시글 수정 토글 버튼
    const toggleEditng = () =>setModalIsOpen_edit(true);


    //게시글 수정 확인 버튼
    const onSubmit = async(event) => {
        event.preventDefault();
        console.log(attachment)
        
        await updateDoc(NweetTextRef,{
            text: newNweet,
            attachment: attachment,
        });
        toast('수정 완료!');
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewNweet(value);
    };

    //좋아요 버튼
    const onClickLikes = async (event) => {
        event.preventDefault();
        
        //nweetObj.TF를 판단하여 T이면 Likes(+1), F이면 Likes(-1)
        if(nweetObj.TF){
            LikeNum += 1;
            await updateDoc(NweetTextRef,{
                likes: LikeNum,
                TF: false,
            });
            toast('Like ♥');
        }else{
            LikeNum -= 1;
            await updateDoc(NweetTextRef,{
                likes: LikeNum,
                TF: true,
            });
        }     
    }



    //사진 파일 감지
    const onFileChange = (event) => {
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        };
        if(theFile){
        reader.readAsDataURL(theFile);
        }
      };

      //사진 대기 비우기
    const onClearAttachment = () => setAttachment("");


    const customModalStyles = {
        overlay: {
          backgroundColor: " rgba(0, 0, 0, 0.6)",
          width: "100%",
          height: "100vh",
          zIndex: "10",
          position: "fixed",
          top: "0",
          left: "0",
        },
        content: {
          width: "400px",
          height: "500px",
          zIndex: "150",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px",
          boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
          backgroundColor: "white",
          justifyContent: "center",
          overflow: "auto",
        },
      };

    
    return (
    <div  className="nweet">
        <Modal
            isOpen={modalIsOpen_edit}
            onRequestClose={() => setModalIsOpen_edit(false)}
            style={customModalStyles}
            ariaHideApp={false}
                >
                <form onSubmit={onSubmit} className="nweetedit_container">
                    <input
                        type="text"
                        placeholder="내용"
                        className="nweetedit_txtbox"
                        defaultValue={newNweet}
                        required
                        autoFocus
                        onChange={onChange}
                    />
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} idclassName="nweetImg"/>}
                    <label htmlFor="img_file">
                    <span>사진 변경</span>
                    </label>
                    <input 
                     id="img_file"
                     type="file"
                     accept="image/*"
                     onChange={onFileChange}
                     style={{
                        opacity: 0,
                      }}
                />
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <input type="button" onClick={onClearAttachment} value="사진 삭제" />

                    
                </form>                    
                <form className="nweetedit_btn">
                    <input type="submit" className="nweetedit_btnOk" value="완료" />
                    <input type="button" onClick={() => setModalIsOpen_edit(false)} className="nweetedit_btnNo" value="취소" />
                </form>
        </Modal>

        <ToastContainer
                    position="bottom-center" // 알람 위치 지정
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
            <form>
                <div className="nweet_row">
                    <img src={nweetObj.profileImg} style={{width:60, height:60, borderRadius:100}}/>
                    <h2>{nweetObj.displayname}</h2>
                    <h4>{returnDate}</h4>
                </div>
                <br></br>
                <br></br>
                <h3>{nweetObj.text}</h3>
                <br></br>
                {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} className="nweetImg"/>}
                <br></br>
                <span onClick={onClickLikes} className="nweet_likes">
                    {nweetObj.Liker}
                    {nweetObj.likes}
                    {nweetObj.TF ? (
                        <FontAwesomeIcon icon={faHeart} style={{marginLeft:5,color:"black"}}/>
                    ):(
                        <FontAwesomeIcon icon={faHeart} style={{marginLeft:5,color:"red"}}/>
                    )}
                    
                </span>
                
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
            </form>
        
    </div>
)
};


/*
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
            */

export default Nweet;