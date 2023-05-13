import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import {addDoc,collection,query,serverTimestamp,getDocs,orderBy, onSnapshot, snapshotEqual} from "firebase/firestore";
import { async } from "@firebase/util";
import Nweet from "components/Nweets";
import{ v4 as uuidv4 } from "uuid";
import { ref,uploadString, getDownloadURL } from "@firebase/storage";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    //사진 첨부없이 텍스트만 트윗할때가 있으므로 기본 값을 ""로 해야함
    //트윗할 때 텍스트만 입력시 이미지 url""로 비워두기 위함
    const [attachment, setAttachment] = useState("");
    useEffect(() => {
        const q = query(
            collection(dbService,"nweets"),
            orderBy("createAt", "desc"),
        );
        onSnapshot(q,(snapshot)=>{
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);
    const onSubmit = async (e) => {
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
      const onClearAttachment = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What are you doing?" maxLength={120}/>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet"/>
                {attachment && (
                    <div>
                        <img src={attachment} width="60px" height="60px"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {nweets.map(nweet => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};
export default Home;
