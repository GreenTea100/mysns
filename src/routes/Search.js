import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Search = ({userObj}) => {


    return(
    <>
        <form className="container">
        <input type="text" value="친구 찾아요" className="formTxtbox" style={{marginBottom:10}} readOnly/>
        
        </form>
    </>
);
};


export default Search;