import { authService, dbService } from "fbase";
import React, { useState } from "react";
import { useNavigate,BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import {getAuth,signOut,updateProfile} from "firebase/auth";
import userEvent from "@testing-library/user-event";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { async } from "@firebase/util";

export default ( {refreshUser, userObj} ) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
        refreshUser();
    };
    /*
    const getMyNweets = async() => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId","==",`${userObj.uid}`)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            //console.log(doc.id, "=>", doc.data());
        });
    };
    useEffect(() => {
        
        getMyNweets();
    }, []);
    */
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser,{displayName:newDisplayName});
            //await updateProfile(userObj,{displayName: newDisplayName,});
            refreshUser();
        }
    }
    return (
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
            <input type="submit" value="Update Profile"/>
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};
