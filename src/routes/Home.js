import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import {addDoc,collection,query,serverTimestamp,getDocs,orderBy, onSnapshot, snapshotEqual} from "firebase/firestore";
import { async } from "@firebase/util";
import Nweet from "components/Nweets";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
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
        try{
        const docRef = await addDoc(collection(dbService,"nweets"),{
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
        });
        
    } catch(e){
        console.error("Error adding document: ",e);
    }
    setNweet("");
};
      const onChange = (e) => {
        const {
            target: {value},
        } = e;
        setNweet(value);
      };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What are you doing?" maxLength={120}/>
                <input type="submit" value="Nweet"/>
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
