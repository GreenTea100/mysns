import React,{useState} from "react";
import { dbService, storageService } from "fbase";
import{ v4 as uuidv4 } from "uuid";
import { ref,uploadString, getDownloadURL } from "@firebase/storage";
import {addDoc,collection,setDoc,doc, getDoc,query} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");


    //게시글 업로드
    const onSubmit = async (e) => {
        if(nweet === ""){
            return;
        }
        (e).preventDefault();
        let attachmentUrl = "";
        let likes = 0;

        //이미지가 없을 수도 있기에 attachment가 있을때만 실행
        if (attachment !== ""){
            //파일 경로 참조 만들기
            const fileRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
            //storage 참조 경로로 파일 업로드 하기
            const response = await uploadString(fileRef, attachment,"data_url");
            //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
            attachmentUrl = await getDownloadURL(response.ref);
        }
            const nweetObj = {
                text: nweet,
                createAt: Date.now(),
                creatorId: userObj.uid,
                displayname: userObj.displayName,
                attachmentUrl,
                profileImg: userObj.photoURL,
                likes,
                TF: true,
            }
        
        try{

        const docRef = await addDoc(collection(dbService,"nweets"),nweetObj);

        
    } catch(e){
        console.error("Error adding document: ",e);
    }
    setNweet("");
    setAttachment("");
    toast('업로드 완료!');
};

    //게시글 본문 감지
    const onChange = (e) => {
        const {
            target: {value},
        } = e;
        setNweet(value);
    };

    
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

    return(
        <form onSubmit={onSubmit} className="factoryForm">
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
            <div className="factoryInput__container">
                <input className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="무엇을 하고 있나요?"
                    maxLength={200}
                />
                <input type="submit" value="&rarr;"  className="factoryInput__arrow"/>
            </div>
                <label htmlFor="attach-file" className="factoryInput__label">
                    <span>사진 추가</span>
                    <FontAwesomeIcon icon={faImage} size="lg"/>
                </label>
                <input 
                     id="attach-file"
                     type="file"
                     accept="image/*"
                     onChange={onFileChange}
                     style={{
                       opacity: 0,
                     }}
                />
                {attachment && (
                    <div className="factoryForm__attachment">
                        <img
                            src={attachment}
                            style={{
                                backgroundImage: attachment,
                            }}
                        />
                        <div className="factoryForm__clear" onClick={onClearAttachment}>
                            <span>삭제</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )}
            </form>
    )
}

export default NweetFactory