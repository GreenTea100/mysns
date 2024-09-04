import { authService} from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {updateProfile} from "firebase/auth";
import { dbService, storageService } from "fbase";
import{ v4 as uuidv4 } from "uuid";
import { deleteObject,ref,uploadString, getDownloadURL } from "firebase/storage";
import { updateDoc, doc, getDoc, collection, onSnapshot, query, where, orderBy, getDocs,} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faXmark, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import Nweet from "components/Nweets";
import Shortload from "./Shortload";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import { getYear, getMonth } from "date-fns"; // getYear, getMonth 
import { selectBOX } from "components/selectBox";
import { FormControl, FormControlLabel, Radio, RadioGroup,FormLabel } from '@mui/material';
const _ = require('lodash');



export default ( {refreshUser, userObj, usersObj} ) => {
    const navigate = useNavigate();
    const [Mylist, setMylist] = useState(false);
    const [profileimg, setprofileimg] = useState("");
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [newArea, setNewArea] = useState();
    const [newBirth, setNewBirth] = useState();
    const [newGender, setNewGender] = useState();
    const desertRef = ref(storageService, userObj.photoURL);
    const [mynweets, setMynweets] = useState([]);
    const [myshorts, setMyshorts] = useState([]);
    const [myinfo_area, setMyinfo_area] = useState([]);
    const [myinfo_birth, setMyinfo_birth] = useState([]);
    const [myinfo_gender, setMyinfo_gender] = useState([]);
    const [myinfo_intro, setMyinfo_intro] = useState([]);
    const [myinfo_follower, setMyinfo_follower] = useState([]);
    const [myinfo_following, setMyinfo_following] = useState([]);

    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen002, setModalIsOpen002] = useState(false);
    const [modalIsOpen_follower, setModalIsOpen_follower] = useState(false);
    const [modalIsOpen_following, setModalIsOpen_following] = useState(false);

    const [birth, setBirth] = useState(new Date());  //날짜팝업
    const years = _.range(1920, getYear(new Date()) + 1, 1); // 수정
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    
    const [sidosido, setsidosido] = useState("");
    const [gugungugun, setgugungugun] = useState("");
    const area = sidosido + " / " + gugungugun

    const [gender, setGender] = useState(''); // 선택된 성별 상태를 저장할 state



    const [gender1, setGender1] = useState([]);
    const [myArea, setMyArea] = useState([]);
    const [myBirth, setMyBirth] = useState([]);
    const [myGender, setMyGender] = useState([]);


    const [modalIsOpen1, setModalIsOpen1] = useState(false);



    const [myinfo, setMyinfo] = useState([]);

    //모달창에서 selectBox불러오기
    const over = () => {
        if (modalIsOpen1 == false) {
            selectBOX();
            setModalIsOpen1(true);
        };
    };

    
    //콤보박스 입력받기
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;

        if (name === "sido1") {
            // setsidosido(value + "/");
            setsidosido(value);
        } else if (name === "gugun1") {
            // setgugungugun(sidosido + value);
            setgugungugun(value);
        }
    };



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


        //나의 정보 실시간 가져오기
        const qqq = query(
            collection(dbService,"users"),
            where("uid", "==", userObj.uid),
        );
        onSnapshot(qqq,(snapshot)=>{
            const infoArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setMyinfo(infoArray[0]);
        });

    },[]);


    function AAA({user}){
        return(
            <div>
                <b>{user.follower}</b>
            </div>
        );
    }
    



    //나의 정보 가져오기
    const fetchData = async (e) => {

            const docRef = doc(dbService, "users", userObj.uid);
            const docSnap = await getDoc(docRef);

            setMyinfo_area(docSnap.data().area);
            setMyinfo_birth(docSnap.data().birth);
            setMyinfo_gender(docSnap.data().gender);
            setMyinfo_intro(docSnap.data().introduction);
            setMyinfo_follower(docSnap.data().follower);
            setMyinfo_following(docSnap.data().following);

            setMyArea(docSnap.data().area);
            setMyBirth(docSnap.data().birth);
            setMyGender(docSnap.data().gender);
            console.log("fetchdata 함수 안");
    };
    //fetchData();
    let area1 = myArea;
    

    //프로필 정보 바꾸기
    const onClick_changeInfo = async (e) => {
        e.preventDefault();
        fetchData();
        area1 = area;
        await updateDoc(doc(dbService, "users", userObj.uid), {
            area: area1
        });

        await updateDoc(doc(dbService, "users", userObj.uid), {
            gender: gender1
        });
        toast('프로필 정보변경!');
        setGender1("");
        console.log("sidosido : " + sidosido);
        console.log("gugungugun : " + gugungugun);
        console.log("mygender : "+ myGender);
        console.log("gender1 : "+ gender1);
    }

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
    console.log(myinfo)


    //작성 시 값 저장
    const onChange_name = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    const onChange_area = (event) => {
        const {
            target: {value},
        } = event;
        setMyinfo_area(value);
    }
    const onChange_birth = (event) => {
        const {
            target: {value},
        } = event;
        setNewBirth(value);
    }
    const onChange_gender = (event) => {
        const {
            target: {value},
        } = event;
        setMyinfo_gender(value);
    }
    const onChange_1 = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "startDate") {
            setBirth(value);
        } else if (name === "sido1") {
            setsidosido(value);
        } else if (name === "gugun1") {
            setgugungugun(value);
        } else if (name === "gender") {
            setGender(value);
        }
    };
    
    


    //닉네임 변경
    const onSubmit = async (event) => {
        event.preventDefault();
        fetchData();

            const ok = window.confirm("정보를 변경하시겠습니까?");
            if(ok){
                await updateProfile(authService.currentUser,{displayName:newDisplayName});

                await updateDoc(doc(dbService, "users", userObj.uid), {
                    area: area1
                });

                await updateDoc(doc(dbService, "users", userObj.uid), {
                    gender: myinfo_gender
                });

                // await updateDoc(doc(dbService, "users", userObj.uid),{
                //     area: newArea,
                //     birth: newBirth,
                //     gender: newGender,
                // });

                //기존 게시글들의 닉네임 변경
                for(let i = 0; i < mynweets.length; i++){
                    await updateDoc(doc(dbService,"nweets",`${mynweets[i].id}`),{
                        displayname: newDisplayName,
                    });
                    console.log("포문수생중")
                }

                //기존 쇼츠들의 닉네임 변경
                for(let i = 0; i < myshorts.length; i++){
                    await updateDoc(doc(dbService,"shorts",`${myshorts[i].id}`),{
                        displayname: newDisplayName,
                    });
                }

                refreshUser();
                toast('닉네임이 변경 되었습니다');

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

    //모달창 디자인
    const customModalStyles = {
        overlay: {
          backgroundColor: " rgba(0, 0, 0, 0.6)",
          width: "100%",
          height: "100vh",
          zIndex: "10",
          position: "fixed",
          top: "0",
          left: "0",
        },
        content: {
          width: "400px",
          height: "600px",
          zIndex: "150",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px",
          boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
          backgroundColor: "white",
          justifyContent: "center",
          overflow: "auto",
        },
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value); // 라디오 버튼 변경 시 선택된 값을 상태에 업데이트
    };




    return (
        <div className="container">
            
            <form className="profileForm">
                <>
                    <div className="profile_img">
                        <span className="profile_updatemodal" onClick={() => setModalIsOpen002(true)}>
                            프로필 편집
                        </span>
                        <img src={userObj.photoURL} className="profile_img" />
                    </div>
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
                <br></br>
                
                <span>
                {newDisplayName}&emsp;&emsp;&emsp;&emsp;&emsp; <span onClick={() => setModalIsOpen_follower(true)}>{myinfo_follower.length} 팔로워</span> &emsp;&emsp;<span onClick={() => setModalIsOpen_following(true)}>{myinfo_following.length} 팔로잉</span>
                
                </span>
                <br></br>
                {myinfo.birth} | {myinfo.gender} | {myinfo.area}
                <br></br><br></br>
                {myinfo.introduction}


            </form>
            <Modal
                isOpen={modalIsOpen_follower}
                onRequestClose={() => setModalIsOpen_follower(false)}
                style={customModalStyles}
                ariaHideApp={false}
            >

                <div>
                    {
                        myinfo.follower
                    }
                </div>

            </Modal>
            <Modal
                isOpen={modalIsOpen_following}
                onRequestClose={() => setModalIsOpen_following(false)}
                style={customModalStyles}
                ariaHideApp={false}
            >
                {myinfo.following}

            </Modal>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={customModalStyles}
            >

                <form onMouseOver={over} className="modal_register">


                    <div>
                        <label className="modal_labelArea" >성별</label>
                        <label>  :  </label>
                        <input name="gender" value={myGender}></input>
                        {/* <input type="button" onClick={onClick_info} value={"변경"} /> */}
                    </div>


                    {/* <label className="modal_label" >성별</label> */}
                    <FormControl component="fieldset">
                        {/* <FormLabel component="legend">성별</FormLabel> */}
                        <RadioGroup
                            aria-label="gender"
                            name="mygender"
                            value={gender1}
                            onChange={handleGenderChange}
                            row
                        >
                            <div className="gender_select">
                                <FormControlLabel value="남성" control={<Radio />} label="남성" />
                                <FormControlLabel value="여성" control={<Radio />} label="여성" />
                            </div>

                        </RadioGroup>
                        {/* <p>선택된 성별: {gender}</p> */}
                    </FormControl>

                    <div>
                        <label className="modal_labelArea" >지역</label>
                        <label>  :  </label>
                        <input name="area" value={area1}></input>
                        {/* <input type="button" onClick={onClick_info} value={"변경"} /> */}
                    </div>


                    <div style={{ marginBottom: 25 }}>
                        <select name="sido1" id="sido1" value={sidosido} onChange={onChange}></select>
                        <select name="gugun1" id="gugun1" value={gugungugun} onChange={onChange}></select>
                    </div>

                    <input type="button" onClick={onClick_changeInfo} value={"변경"} />

                </form>
            </Modal>

            <Modal
                isOpen={modalIsOpen002}
                onRequestClose={() => setModalIsOpen002(false)}
                style={customModalStyles}
                ariaHideApp={false}
            >
                
                <div className="profile_img">
                    <img src={userObj.photoURL} className="profile_img" />
                    <label htmlFor="change" className="profile_NewimgBtn"><FontAwesomeIcon icon={faRepeat} size="2x" /></label>
                    <input id="change" type="File" accept="image/*" onChange={onFileChange} style={{ opacity: 0 }} />

                    <label htmlFor="default" className="profile_DefaultBtn"><FontAwesomeIcon icon={faXmark} size="xl" /></label>
                    <input id="default" type="button" onClick={onFileDefault} style={{ opacity: 0 }} />
                </div>
                {profileimg && (
                    <div style={{ top: 100 }}>
                        <>
                            <img src={profileimg} className="profile_img" />
                            <button onClick={onImgchange} className="profileImg_updateBtn">적용</button>
                            <button onClick={onClearimg} className="profileImg_cancelBtn">취소</button>
                        </>
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <input
                        onChange={onChange_name}
                        type="text"
                        placeholder="닉네임"
                        className="formBtn updateDisplayname"
                        value={newDisplayName}
                    />

                    <input
                        onChange={onChange_gender}
                        type="text"
                        placeholder="성별"
                        className="formBtn updateDisplayname"
                        value={myinfo_gender}
                    />

                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="gender"
                            name="gender"
                            value={myinfo_gender}
                            onChange={handleGenderChange}
                            row
                        >
                            <div className="gender_select">
                                <FormControlLabel value="남성" control={<Radio />} label="남성" />
                                <FormControlLabel value="여성" control={<Radio />} label="여성" />
                            </div>

                        </RadioGroup>
                    </FormControl>

                    <div style={{ marginBottom: 25 }}>
                        <select name="sido1" id="sido1" value={sidosido} onChange={onChange}></select>
                        <select name="gugun1" id="gugun1" value={gugungugun} onChange={onChange}></select>
                    </div>

                    <div>
                        <input
                            type="submit"
                            value="저장"
                            className="formBtn"
                            style={{ marginTop: 10 }}
                        />
                        <input type="button"
                            onClick={() => setModalIsOpen002(false)}
                            className="formBtn logOut"
                            value={"취소"}
                        />
                    </div>
                </form>
            </Modal>

        
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
