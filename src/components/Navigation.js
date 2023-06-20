import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({userObj}) => (
<nav>
    <ul  style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
        <li>
            <Link to="/" style={{
                marginRight:30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: 12,
            }}>
                <FontAwesomeIcon icon={faHouse} color={"#50AF49"} size="3x" />
                <span style={{marginTop: 10}}>
                    홈
                </span>
            </Link>
        </li>
        <li style={{marginTop: 30}}>
            <Link to="/profile" style={{
                marginRight:30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: 12,
            }}>
                <FontAwesomeIcon icon={faUser} color={"#50AF49"} size="3x"/>
                <span style={{marginTop: 10}}>
                    {userObj.displayName ? `${userObj.displayName}님의 프로필` : "Profile"}
                </span>
            </Link>
        </li>
    </ul>
</nav>
);
export default Navigation;