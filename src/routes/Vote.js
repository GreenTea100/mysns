import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {addDoc,collection,setDoc,doc, getDoc,query} from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Vote = ({userObj}) => {

    const navigate = useNavigate();


    const go1 = () =>{
        navigate('/vote/1');
    }
    const go2 = () =>{
        navigate('/vote/2');
    }
    const go3 = () =>{
        navigate('/vote/3');
    }
    const go4 = () =>{
        navigate('/vote/4');
    }




    return(
        <div className="container">
            <input type="text" value="당신의 최애에게 투표하세요" className="formTxtbox" style={{marginBottom:10,fontWeight: 700}} readOnly/>
            <br></br><br></br>
            <label className="formVotebox" onClick={go1}>현 축구 국가대표 원탑 누구?</label><br></br><br></br>
            <label className="formVotebox" onClick={go2}>최애 라면은?</label><br></br><br></br>
            <label className="formVotebox" onClick={go3}>환승이별 VS 잠수이별</label><br></br><br></br>
            <label className="formVotebox" onClick={go4}>평생 두통 VS 평생 치통</label><br></br><br></br>

        </div>
    );
};
export default Vote;