import React, { useState } from "react";
import { getAuth,createUserWithEmailAndPassword,} from "firebase/auth";
import { authService } from "fbase";
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
                // Create account
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else{
                //log in
                data = await authService.signInWithEamilAndPassword(email, password);
            }
            console.log(data);
        } catch (error){
            setError(error.message.replace("Firebase:",""));
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return(
    <>
        <form onSubmit={onSubmit} className="container">
            <input name="email" type="email" placeholder="이메일" required value={email} onChange={onChange} className="authInput" />
            <input name="password" type="password" placeholder="패스워드" required value={password} onChange={onChange} className="authInput"/>
            <input type="submit" className="authInput authSubmit"  value={newAccount ? "Create Account" : "Log In"} />
            {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={toggleAccount}  className="authSwitch">{newAccount ? "Sign in" : "Create Account"}</span>
    </>
    );
}
export default AuthForm