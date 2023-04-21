import { authService } from "fbase";
import React from "react";
import { useNavigate,BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import {getAuth,signOut} from "firebase/auth";


export default () => {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};
