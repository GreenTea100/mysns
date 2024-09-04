import React, { useState } from "react";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
import { authService } from "fbase";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-modal";
import {addDoc,collection,setDoc,doc, getDoc,query} from "firebase/firestore";
import { dbService, storageService } from "fbase";
import { connectStorageEmulator } from "firebase/storage";
import { async } from "@firebase/util";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import { getYear, getMonth } from "date-fns"; // getYear, getMonth 
import { selectBOX } from "./selectBox";
import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';
const _ = require('lodash');



const AuthForm = () => {
    const [email, setEamil] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    
   
    const [error, setError] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);


    const [birth, setBirth] = useState(new Date());  //날짜팝업
    const years = _.range(1920, getYear(new Date()) + 1, 1); // 수정
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    const [sidosido, setsidosido] = useState("");
    const [gugungugun, setgugungugun] = useState("");
    const area = sidosido + " / " + gugungugun

    const [modalIsOpen1, setModalIsOpen1] = useState(false);

    const [gender, setGender] = useState(''); // 선택된 성별 상태를 저장할 state
   
    const over = () => {
        if (modalIsOpen1 == false) {
            selectBOX();
            setModalIsOpen1(true);
        };
    };

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEamil(value);
        } else if (name === "password") {
            setPassword(value);
        } else if (name === "password2") {
            setPassword2(value);
        } else if (name === "startDate") {
            setBirth(value);
        } else if (name === "sido1") {
            setsidosido(value);
        } else if (name === "gugun1") {
            setgugungugun(value);
        }
        else if (name === "gender") {
            setGender(value);
        }
    };
    
    //기존 페이지의 로그인 onSubmit
    const onSubmit = async(event) => {
        event.preventDefault();
        try{
            const auth = getAuth();
            let data;
            
            //log in
            data = await signInWithEmailAndPassword(auth, email, password);
           
        } 

        catch (error){
            if(error.message === "fbase__WEBPACK_IMPORTED_MODULE_2__.authService.signInWithEamilAndPassword is not a function"){
                toast('이메일과 패스워드를 확인해주세요');
            }else if(error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                toast('패스워드의 보안성이 낮습니다');
            }else if(error.message === "Firebase: Error (auth/email-already-in-use)."){
                toast('이미 사용중인 이메일 입니다');
            }
        }
    };

    //모달창의 회원가입 onSubmit
    const onSubmit_2 = async(event) => {
        event.preventDefault();
        
        //if(password === password2){
            try{
                const auth = getAuth();

                let data;

                // Create account
                data = await createUserWithEmailAndPassword(auth, email, password);

                const user = authService.currentUser;
                const usersObj = {
                    uid: user.uid,
                    createAt: Date.now(),
                    birth: birth.toLocaleDateString('ko-KR'),
                    area: area,
                    gender: gender,
                    introduction: "",
                    follower: [],
                    following: []
                }

                await setDoc(doc(dbService,"users",user.uid),usersObj);


            }

            catch (error){
                if(error.message === "fbase__WEBPACK_IMPORTED_MODULE_2__.authService.signInWithEamilAndPassword is not a function"){
                    toast('이메일과 패스워드를 확인해주세요');
                }else if(error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                    toast('패스워드의 보안성이 낮습니다');
                }else if(error.message === "Firebase: Error (auth/email-already-in-use)."){
                    toast('이미 사용중인 이메일 입니다');
                }
            }
        //}


        

    }
    const handleGenderChange = (event) => {
        setGender(event.target.value); // 라디오 버튼 변경 시 선택된 값을 상태에 업데이트
    };

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
          height: "500px",
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

    return(
    <>
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
        <form onSubmit={onSubmit} className="container">
            <input name="email" type="email" placeholder="이메일" required value={email} onChange={onChange} className="authInput" />
            <input name="password" type="password" placeholder="패스워드" required value={password} onChange={onChange} className="authInput"/>
            <input type="submit" className="authInput authSubmit"  value={"로그인"} />
            {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={() => { setModalIsOpen(true); setModalIsOpen1(false); }} className="authSwitch">{"회원가입"}</span>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={customModalStyles}
            ariaHideApp={false}
            >
            
            <form onMouseOver={over} onSubmit={onSubmit_2} className="modal_register">
                <label className="modal_title">회원가입</label>
                <label>이메일</label>
                <input name="email" type="email" required value={email} onChange={onChange} className="authInput" />
  
            
            <label>패스워드</label>
            <input name="password" type="password" required value={password} onChange={onChange} className="authInput"/>
            <label>패스워드 확인</label>
            <input name="password2" type="password"  required value={password2} onChange={onChange} className="authInput"/>
            <label className="modal_label" >성별</label>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="gender"
                            name="gender"
                            value={gender}
                            onChange={handleGenderChange}
                            row
                        >
                            <div className="gender_select">
                                <FormControlLabel value="남성" control={<Radio />} label="남성" />
                                <FormControlLabel value="여성" control={<Radio />} label="여성" />
                            </div>

                        </RadioGroup>
                    </FormControl>

            <label>생년월일</label>
            <DatePicker
                        className="modal_dateInput"
                        renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled
                        }) => (
                            <div
                                style={{
                                    margin: 10,
                                    display: "flex",
                                    justifyContent: "center"
                                }}
                            >
                                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                    {"<"}
                                </button>
                                <select
                                    value={getYear(date)}
                                    onChange={({ target: { value } }) => changeYear(value)}
                                >
                                    {years.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={months[getMonth(date)]}
                                    onChange={({ target: { value } }) =>
                                        changeMonth(months.indexOf(value))
                                    }
                                >
                                    {months.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                    {">"}
                                </button>
                                
                            </div>
                        )}

                        showIcon
                        selected={birth}
                        dateFormat={"yyyyMMdd"}
                        locale={ko}
                        onChange={date => setBirth(date)}

                        placeholderText="생년월일 8자리를 입력하세요."
                        isClearable
                        required
                        value={birth}
                        maxDate={new Date()}
                        name="startDate"
                    />

            <label>지역</label>
                    <div style={{ marginBottom: 25 }}>
                        <select name="sido1" id="sido1" value={sidosido} onChange={onChange}></select>
                        <select name="gugun1" id="gugun1" value={gugungugun} onChange={onChange}></select>
                    </div>

            <input type="submit" className="authInput authSubmit"  value={"제출"} />
            <input type="button" onClick={()=>setModalIsOpen(false)} className="formBtn logOut"  value={"취소"} />
            </form>
        </Modal>
    </>
    );
}

export default AuthForm