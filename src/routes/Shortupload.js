import { dbService,storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref,uploadString, getDownloadURL } from "@firebase/storage";
import{ v4 as uuidv4 } from "uuid";
import {addDoc,collection} from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo,faTimes } from "@fortawesome/free-solid-svg-icons";


const Shortupload = ({userObj}) => {
    const navigate = useNavigate();
    const [attachment, setAttachment] = useState("");
    const [short_text, setShort_text] = useState("");


    const back = () =>{
        navigate('/short_form');
    }

    //영상 업로드 대기
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

    //영상 대기 지우기
    const onClearAttachment = () => setAttachment("");



    //영상 디비에 업로드
    const DBupload = async (e) => {
        (e).preventDefault();
        //영상 있는지 확인
        if (attachment !== ""){
            let attachmentUrl = "";
            let likes = 0;

            //파일 경로 참조 만들기
            const fileRef = ref(storageService,`${userObj.uid}/short-form/${uuidv4()}`);
            //storage 참조 경로로 파일 업로드 하기
            const response = await uploadString(fileRef, attachment,"data_url");
            //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
            attachmentUrl = await getDownloadURL(response.ref);
        
            const shortObj = {
                text: short_text,
                createAt: Date.now(),
                creatorId: userObj.uid,
                displayname: userObj.displayName,
                attachmentUrl,
                profileImg: userObj.photoURL,
                likes,
                TF: true,
            }
        
            const docRef = await addDoc(collection(dbService,"shorts"),shortObj);
            
            toast('업로드 완료!');
            setShort_text("");
            setAttachment("");
            navigate('/short_form');
            
        }
        else{
            toast('반드시 영상을 첨부해주세요!');
        }
    };


    //본문 감지
    const onChange = (e) => {
        const {
            target: {value},
        } = e;
        setShort_text(value);
    };


    return(
    <>
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
                    limit={1} // 알람 개수 제한
        />
        <form className="container">
        <input type="text" value="영상 업로드" className="formTxtbox" style={{marginBottom:10,fontWeight: 700}} readOnly/>


        <div className="shortupload_row">
            <span type="button" className="shortupload_formBtn" onClick={back}>뒤로가기</span>
            <span type="button" className="shortupload_formBtn" onClick={DBupload} style={{marginLeft:120}}>저장</span>
        </div>
        <input className="shortupload_input"
            value={short_text}
            onChange={onChange}
            type="text"
            placeholder="본문 입력"
            maxLength={200}
        />
        <label htmlFor="video-file" className="shortupload_label">
            <span>영상 첨부 </span>
            <FontAwesomeIcon icon={faVideo} size="lg"/>
        </label>
        <input id="video-file" type="file" accept="video/*" onChange={onFileChange} style={{opacity:0}}/> 
        {attachment && (
            <div className="shortupload_attachment">
                <video src={attachment}/>
                <div className="shortupload_clear" onClick={onClearAttachment}>
                    <span>삭제</span>
                    <FontAwesomeIcon icon={faTimes} size="lg"/>
                </div>
            </div>
        )}
               
        </form>
    </>
);
};


export default Shortupload;