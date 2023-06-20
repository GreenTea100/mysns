import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth,async(user) => {
      if (user){
        
        if(user.displayName === null){
          const name = user.email.split('@')[0];
          await updateProfile(user,{displayName:name});
          refreshUser();
        }
        
        setIsLoggedIn(true);
        setUserObj({
          displayName:user.displayName,
          uid:user.uid,
          updateProfile: (args) => updateProfile(args),
        });
        const uid = user.uid;
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName:user.displayName,
      uid:user.uid,
      updateProfile: (args) => updateProfile(args),
    });
  };
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} />
       : "Initializing..."}
      
    </>
  );
}

export default App;
