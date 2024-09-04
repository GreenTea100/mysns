import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import {collection,query, orderBy, onSnapshot, where} from "firebase/firestore";
import Nweet from "components/Nweets";
import { useNavigate } from "react-router-dom";
import NweetFactory from "components/NweetFactory";


const Home = ({userObj}) => {
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


    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>

            <div style={{marginTop: 10, overflow: "auto"}}>
                {nweets.map(nweet => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} userObj={userObj}/>
                ))}
            </div>
        </div>
    );
};
export default Home;
