import { authService } from "fbase";
import React from "react";
import { GithubAuthProvider,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const Auth = () => {
    const onSocialClick = async (event) => {
        const {target:{name},} = event;
        let provider;
        if (name === "google"){
            provider = new GoogleAuthProvider();
        } else if (name === "github"){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(authService, provider);

    };
    return (
    <div className="authContainer">
        <FontAwesomeIcon icon={faCrown} color={"#50AF49"} size="4x" style={{marginBottom: 30}}/>
        <AuthForm/>
        <div className="authBtns">
            <button onClick={onSocialClick} name="google" className="authBtn">
                <FontAwesomeIcon icon={faGoogle} size="1x"/> Google로 로그인
            </button>
            <button onClick={onSocialClick} name="github" className="authBtn">
                <FontAwesomeIcon icon={faGithub}size="1x"/> Github로 로그인
            </button>
        </div>
    </div>
    );
};
export default Auth;