import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "../routes/Profile";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Short from "routes/Short";
import Shortupload from "routes/Shortupload";
import Vote from "routes/Vote";
import Navigation from "./Navigation";
import Vote1 from "routes/Vote1";
import Vote2 from "routes/Vote2";
import Vote3 from "routes/Vote3";
import Vote4 from "routes/Vote4";


const AppRouter = ({refreshUser, isLoggedIn, userObj}) => {
    return (
        <div
            style={{
                maxWidth: 890,
                width: "100%",
                margin:"0 auto",
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
            }}
        >
        <Router>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Routes>
                {isLoggedIn ? (
                <>
                    <Route exact path="/" element={<Home userObj={userObj}/>}>

                    </Route>
                    <Route exact path="/short_form" element={<Short userObj={userObj}/>}>

                    </Route>
                    <Route exact path="/short_form/upload" element={<Shortupload userObj={userObj}/>}>

                    </Route>
                    <Route exact path="/vote" element={<Vote userObj={userObj}/>}>

                    </Route>
                    <Route exact path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser}/>}>

                    </Route>
                    <Route exact path="/vote/1" element={<Vote1 userObj={userObj}/>}>

                    </Route>
                    <Route exact path="/vote/2" element={<Vote2 userObj={userObj}/>}>

                    </Route>
                    <Route exact path="/vote/3" element={<Vote3 userObj={userObj}/>}>

                    </Route>
                    <Route exact path="/vote/4" element={<Vote4 userObj={userObj}/>}>

                    </Route>
                </>
                ) : (
                    
                    <Route exact path="/" element={<Auth/>}>

                    </Route>
                    )}
            </Routes>
        </Router>
        </div>
    );
}
export default AppRouter;