import React,{useState} from "react";
import { dbService, storageService } from "fbase";
import{ v4 as uuidv4 } from "uuid";
import { ref,uploadString, getDownloadURL } from "@firebase/storage";
import {addDoc,collection} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (e) => {
        if(nweet === ""){
            return;
        }
        (e).preventDefault();
        let attachmentUrl = "";

        //이미지 첨부하지 않고 텍스트만 올리고 싶을때도  있기에 attachment가 있을때만 실행
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
                attachmentUrl,
            }
        
        try{
        const docRef = await addDoc(collection(dbService,"nweets"),nweetObj);
        
    } catch(e){
        console.error("Error adding document: ",e);
    }
    setNweet("");
    setAttachment("");

};
      const onChange = (e) => {
        const {
            target: {value},
        } = e;
        setNweet(value);
      };
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
        reader.readAsDataURL(theFile);
      };
      const onClearAttachment = () => setAttachment("");
    return(
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What are you doing?"
                    maxLength={120}
                />
                <input type="submit" /*value="Up"*/ accept="&hearts;" className="factoryInput__arrow"/>
            </div>
                <label htmlFor="attach-file" className="factoryInput__label">
                    <span>Add photo</span>
                    <FontAwesomeIcon icon={faPlus}/>
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
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )}
            </form>
    )
}

export default NweetFactory