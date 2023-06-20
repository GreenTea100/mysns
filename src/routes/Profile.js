import { authService} from "fbase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {updateProfile} from "firebase/auth";



export default ( {refreshUser, userObj} ) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        const ok = window.confirm("로그이웃 하시겠습니까?");
        if(ok){
        authService.signOut();
        navigate("/");
        refreshUser();
        };
    };
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
            refreshUser();
        }
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange}
                    type="text"
                    placeholder="Display name"
                    className="formBtn updateDisplayname"
                    value={newDisplayName}
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{marginTop:10}}
                />
            </form>
            <span className="formBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};
