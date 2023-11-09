import { authService} from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {updateProfile} from "firebase/auth";
import { dbService, storageService } from "fbase";
import{ v4 as uuidv4 } from "uuid";
import { deleteObject,ref,uploadString, getDownloadURL } from "firebase/storage";
import {addDoc,updateDoc,setDoc,Doc,doc,collection, getDocs, getDoc, Firestore, onSnapshot, query, where, orderBy,} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faRoad, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nweet from "components/Nweets";
import { color } from "@mui/system";
import Shortload from "./Shortload";
import { radioClasses } from "@mui/material";
import { Tune } from "@mui/icons-material";



export default ( {refreshUser, userObj, nweetObj} ) => {
    const navigate = useNavigate();
    const [Mylist, setMylist] = useState(false);
    const [profileimg, setprofileimg] = useState("");
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const desertRef = ref(storageService, userObj.photoURL);
    const [mynweets, setMynweets] = useState([]);
    const [myshorts, setMyshorts] = useState([]);


    useEffect(() => {
        //나의 게시글 가져오기
        const q = query(
            collection(dbService,"nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createAt", "desc"),
        );
        onSnapshot(q,(snapshot)=>{
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMynweets(nweetArray);
        });

        //나의 쇼츠 가져오기
        const qq = query(
            collection(dbService,"shorts"),
            where("creatorId", "==", userObj.uid),
            orderBy("createAt", "desc"),
        );
        onSnapshot(qq,(snapshot)=>{
            const shortArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMyshorts(shortArray);
        });
    }, []);



    // 로그아웃
    const onLogOutClick = () => {
        const ok = window.confirm("로그이웃 하시겠습니까?");
        if(ok){
        authService.signOut();
        navigate("/");
        refreshUser();
        };
    };

    
    //프사 업로드 대기
    const onFileChange = async (event) => {
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setprofileimg(result);
        };
        reader.readAsDataURL(theFile);
        
      };

    //프사 대기 비우기
    const onClearimg = () => setprofileimg("");


    // 프사 기본으로 변경
    const onFileDefault = async() => {
        if(userObj.photoURL !== "/mysns/static/media/default_img.2b6ba0da880eb17eb88b.png"){
            const ok = window.confirm("기본 사진으로 변경 하시겠습니까?");
            if(ok){
                await updateProfile(authService.currentUser,{photoURL:require('./default_img.png')});
                refreshUser();

                //기존 게시글들의 프사 변경
                for(let i = 0; i < mynweets.length; i++){
                    await updateDoc(doc(dbService,"nweets",`${mynweets[i].id}`),{
                        profileImg: "/mysns/static/media/default_img.2b6ba0da880eb17eb88b.png",
                    });
                }

                //기존 쇼츠들의 프사 변경
                for(let i = 0; i < myshorts.length; i++){
                    await updateDoc(doc(dbService,"shorts",`${myshorts[i].id}`),{
                        profileImg: "/mysns/static/media/default_img.2b6ba0da880eb17eb88b.png",
                    });
                }
                toast('프로필 사진이 변경 되었습니다');
            }
        }else{
            toast('이미 기본 사진입니다');
        }
      }

    //프사 변경
    const onImgchange = async (event) => {
        event.preventDefault();
        let profileimgUrl = "";

        if (profileimg !== ""){
            const ok = window.confirm("프로필 사진을 변경하시겠습니까?");
            if(ok){
                //기존 이미지 Storage에서 삭제
                if(userObj.photoURL !== "/mysns/static/media/default_img.2b6ba0da880eb17eb88b.png"){
                    await deleteObject(desertRef);
                }
            //파일 경로 참조 만들기
            const fileRef = ref(storageService,`${userObj.uid}/profile-img/${uuidv4()}`);
            //storage 참조 경로로 파일 업로드 하기
            const response = await uploadString(fileRef, profileimg,"data_url");
            //storage 참조 경로에 있는 파일의 URL을 다운로드해서 profileimgUrl 변수에 넣어서 업데이트
            profileimgUrl = await getDownloadURL(response.ref);

            userObj.photoURL = profileimgUrl;

            await updateProfile(authService.currentUser,{photoURL:profileimgUrl});

            //기존 게시글들의 프사 변경
            for(let i = 0; i < mynweets.length; i++){
                await updateDoc(doc(dbService,"nweets",`${mynweets[i].id}`),{
                    profileImg: profileimgUrl,
                });
            }

            //기존 쇼츠들의 프사 변경
            for(let i = 0; i < myshorts.length; i++){
                await updateDoc(doc(dbService,"shorts",`${myshorts[i].id}`),{
                    profileImg: profileimgUrl,
                });
            }

            refreshUser();
            onClearimg();
            toast('프로필 사진이 변경 되었습니다');
            };
            
        };
    };


    //닉네임 변경시 값 저장
    const onChange_name = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    


    //닉네임 변경
    const onSubmit = async (event) => {
        event.preventDefault();

        if(userObj.displayName !== newDisplayName){
            const ok = window.confirm("닉네임을 변경하시겠습니까?");
            if(ok){
                await updateProfile(authService.currentUser,{displayName:newDisplayName});

                //기존 게시글들의 프사 변경
                for(let i = 0; i < mynweets.length; i++){
                    await updateDoc(doc(dbService,"nweets",`${mynweets[i].id}`),{
                        displayname: newDisplayName,
                    });
                }

                //기존 쇼츠들의 프사 변경
                for(let i = 0; i < myshorts.length; i++){
                    await updateDoc(doc(dbService,"shorts",`${myshorts[i].id}`),{
                        displayname: newDisplayName,
                    });
                }

                refreshUser();
                toast('닉네임이 변경 되었습니다');

            };
        };
    };

    //나의 쇼츠 토글
    const toggleMylistT = () => {
        setMylist(true);
    }
    //나의 게시글 토글
    const toggleMylistF = () => {
        setMylist(false);
    }

    return (
        <div className="container">
            
            <form onSubmit={onSubmit} className="profileForm">
                <>
                <div className="profile_img">
                <img src={userObj.photoURL} className="profile_img"/>
                <label htmlFor="change" className="profile_NewimgBtn"><FontAwesomeIcon icon={faRepeat} size="2x"/></label>
                <input id="change" type="File" accept="image/*" onChange={onFileChange} style={{opacity:0}}/>

                <label htmlFor="default" className="profile_DefaultBtn"><FontAwesomeIcon icon={faXmark} size="xl"/></label>
                <input id="default" type="button" onClick={onFileDefault} style={{opacity:0}}/>
                </div>
                {profileimg && (
                    <div style={{top:100}}>
                        <>
                        <img src={profileimg} className="profile_img" />
                        <button onClick={onImgchange} className="profileImg_updateBtn">적용</button>
                        <button onClick={onClearimg} className="profileImg_cancelBtn">취소</button>
                        </>
                    </div>
                )}
                </>
                    
                <ToastContainer
                    position="bottom-center" // 알람 위치 지정
                    autoClose={2000} // 자동 off 시간
                    hideProgressBar={true} // 진행시간바 숨김
                    closeOnClick // 클릭으로 알람 닫기
                    rtl={false} // 알림 좌우 반전
                    //pauseOnFocusLoss // 화면을 벗어나면 알람 정지
                    draggable // 드래그 가능
                    //pauseOnHover // 마우스를 올리면 알람 정지
                    theme="light"
                    limit={3} // 알람 개수 제한
                />
                <input
                    onChange={onChange_name}
                    type="text"
                    placeholder="닉네임"
                    className="formBtn updateDisplayname"
                    value={newDisplayName}
                />
                <input
                    type="submit"
                    value="닉네임 변경"
                    className="formBtn"
                    style={{marginTop:10}}
                />
            </form>
            <span className="formBtn logOut" onClick={onLogOutClick}>
                로그아웃
            </span>
            
            {Mylist ? (
                <form style={{marginTop:30,marginBottom:20}}>
                    <input type="radio" id="mynweet_btn" name="my" value="글" onClick={toggleMylistF}/>
                    <input type="radio" id="myshorts_btn" name="my" value="쇼츠" onClick={toggleMylistT}/>
                    <label htmlFor="myshorts_btn" className="profile_radioT" style={{fontWeight:"bold"}}>내 쇼츠</label>
                    <label htmlFor="mynweet_btn" className="profile_radioF">내 게시글</label>
                </form>
            ):(
                <form style={{marginTop:30,marginBottom:20}}>
                    <input type="radio" id="mynweet_btn" name="my" value="글" onClick={toggleMylistF}/>
                    <input type="radio" id="myshorts_btn" name="my" value="쇼츠" onClick={toggleMylistT}/>
                    <label htmlFor="myshorts_btn" className="profile_radioT">내 쇼츠</label>
                    <label htmlFor="mynweet_btn" className="profile_radioF" style={{fontWeight:"bold"}}>내 게시글</label>
                </form>
                )}
                
                
            
            {Mylist ? (
                <div style={{marginTop: 30}}>
                    {myshorts.map(short => (
                        <Shortload key={short.id} shortObj={short} isOwner={short.creatorId === userObj.uid}/>
                    ))}
                </div>
            ):(
                <div style={{marginTop: 30}}>
                    {mynweets.map(nweet => (
                        <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} userObj={userObj}/>
                    ))}
                </div>
            )}
            
            

        </div>
    );
    };
