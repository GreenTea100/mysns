import React, { useState } from "react";
import { getAuth,createUserWithEmailAndPassword,} from "firebase/auth";
import { authService } from "fbase";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
    const [email, setEamil] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {
            target: { name, value },
            } = event;
            if (name === "email"){
                setEamil(value);
            } else if (name === "password"){
                setPassword(value);
            }
        };
    const onSubmit = async(event) => {
        event.preventDefault();
        try{
            const auth = getAuth();
            let data;
            if (newAccount){
                //log in
                data = await authService.signInWithEamilAndPassword(email, password);
            } else{
                // Create account
                data = await createUserWithEmailAndPassword(auth, email, password);
            }

        } catch (error){
            if(error.message === "fbase__WEBPACK_IMPORTED_MODULE_2__.authService.signInWithEamilAndPassword is not a function"){
                toast('이메일과 패스워드를 확인해주세요');
            }else if(error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                toast('패스워드의 보안성이 낮습니다');
            }else if(error.message === "Firebase: Error (auth/email-already-in-use)."){
                toast('이미 사용중인 이메일 입니다');
            }
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
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
            <input type="submit" className="authInput authSubmit"  value={newAccount ? "로그인" : "회원가입"} />
            {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={toggleAccount}  className="authSwitch">{newAccount ? "회원가입" : "로그인"}</span>
    </>
    );
}
export default AuthForm