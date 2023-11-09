import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ref,uploadString, getDownloadURL } from "@firebase/storage";
import { deleteObject} from "firebase/storage";
import {addDoc,updateDoc,setDoc,doc,collection,deleteDoc,query, orderBy, onSnapshot, limit} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Shortupload from "./Shortupload";
import Shortload from "./Shortload";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';



const Short = ({userObj, isOwner, shortObj, nweetObj}) => {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [shorts, setShorts] = useState([]);


    //업로드 페이지로 이동
    const upload = () =>{
        navigate('/short_form/upload');
    }


    
    useEffect(() => {
        const q = query(
            collection(dbService,"shorts"),
            orderBy("createAt", "desc"),
        );
        onSnapshot(q,(snapshot)=>{
            const shortArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setShorts(shortArray);
        });
    }, []);
    
    
    
    let num = 1;

    const shortList = shorts.map(short => (<Shortload key={short.id} shortObj={short} isOwner={short.creatorId === userObj.uid}/>))

    /*
    
    */

         

    return(
        <div className="container">
            <input type="text" value="숏폼" className="formTxtbox" style={{marginBottom:10,fontWeight: 700}} readOnly/>
            <label className="formBtn" onClick={upload} style={{marginBottom:20}}>업로드 하기</label>
            <Swiper
                direction={'vertical'}
                slidesPerView={1}
                spaceBetween={10}
                mousewheel={true}
                pagination={{
                    clickable: true,
                }}
                modules={[Mousewheel, Pagination]}
                className="short_Swiper"
            >
                <SwiperSlide className="short_Swiper_slide">{shortList[0]}</SwiperSlide>
                <SwiperSlide className="short_Swiper_slide">{shortList[1]}</SwiperSlide>
                <SwiperSlide className="short_Swiper_slide">{shortList[2]}</SwiperSlide>
                <SwiperSlide className="short_Swiper_slide">{shortList[3]}</SwiperSlide>
                <SwiperSlide className="short_Swiper_slide">{shortList[4]}</SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Short;