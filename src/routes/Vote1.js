import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LabelList, Label } from "recharts";
import {updateDoc, doc, getDoc} from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const Vote1 = () => {
    const navigate = useNavigate();
    const [myvoteA, setMyvoteA] = useState([]);
    const [myvoteB, setMyvoteB] = useState([]);
    const [myvoteC, setMyvoteC] = useState([]);
    const [myvoteD, setMyvoteD] = useState([]);


    //파이어베이스 필드값 가져오는 함수
    const fetchData = async (e) => {
        try {
            const docRef = doc(dbService, "votes", "vote1");
            const docSnap = await getDoc(docRef);

            setMyvoteA(docSnap.data().countA);
            setMyvoteB(docSnap.data().countB);
            setMyvoteC(docSnap.data().countC);
            setMyvoteD(docSnap.data().countD);

            const voteObj = {
                conutA: myvoteA,
                countB: myvoteB,
                countC: myvoteC,
                countD: myvoteD,
            }
        }
        catch (e) {

        }
    };
    //바로 함수사용
    fetchData();

    //A투표카운트세는 변수 선언
    let numA = myvoteA;

    //B투표카운트세는 변수 선언
    let numB = myvoteB;

    //C투표카운트세는 변수 선언
    let numC = myvoteC;

    //B투표카운트세는 변수 선언
    let numD = myvoteD;




    //A에 투표하기
    const voteA = async(e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService,"votes",`vote1`),{
            countA:numA+1
        });
        toast('투표 완료!');
    }

    //B에 투표하기
    const voteB = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote1`), {
            countB: numB + 1
        });
        toast('투표 완료!');
    }

    //C에 투표하기
    const voteC = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote1`), {
            countC: numC + 1
        });
        toast('투표 완료!');
    }

    //D에 투표하기
    const voteD = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote1`), {
            countD: numD + 1
        });
        toast('투표 완료!');
    }


    const golist = () =>{
        navigate('/vote');
    }
    
    //막대바 데이터
    const data = [
        {
            손흥민: numA,
            이강인: numB,
            김민재: numC,
            황희찬: numD,
            amt: 2400,
        }
    ];


    return(
        <>
            <ToastContainer
                position="bottom-center" // 알람 위치 지정
                autoClose={1000} // 자동 off 시간
                hideProgressBar={true} // 진행시간바 숨김
                closeOnClick // 클릭으로 알람 닫기
                rtl={false} // 알림 좌우 반전
                //pauseOnFocusLoss // 화면을 벗어나면 알람 정지
                draggable // 드래그 가능
                //pauseOnHover // 마우스를 올리면 알람 정지
                theme="light"
                limit={1} // 알람 개수 제한
            />
            <div className="container">
                <input type="text" value="당신의 최애에게 투표하세요" className="formTxtbox" style={{ marginBottom: 10 }} readOnly />
                <br></br>
                <div>
                    <label className="formBtn" onClick={golist}>뒤로가기</label>
                </div>
                <br></br><br></br><br></br>
                <label className="vote1Title">현 축구 국가대표 원탑은?</label>


                <BarChart className="voteBar" width={320} height={300} data={data}
                    margin={{
                        top: 10,
                        right: 42,
                        left: -10,
                        bottom: 5,
                    }}
                    // layout="vertical"
                    // barCategoryGap={50}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                        
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar barSize={30} dataKey="손흥민" fill="YellowGreen">
                        <LabelList dataKey="손흥민" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="이강인" fill="Lightskyblue">
                        <LabelList dataKey="이강인" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="김민재" fill="Orange">
                        <LabelList dataKey="김민재" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="황희찬" fill="red">
                        <LabelList dataKey="황희찬" position="top" />
                    </Bar>
                </BarChart>


                <div className="voteBtn">
                    <button className="formChoicebtn1" style={{ marginLeft: 10, backgroundColor:"yellowGreen"}} onClick={voteA} >손흥민</button>
                    <button className="formChoicebtn1" style={{ marginLeft: 10, backgroundColor:"Lightskyblue"}} onClick={voteB} >이강인</button>
                    <button className="formChoicebtn1" style={{ marginLeft: 10, backgroundColor:"Orange"}} onClick={voteC} >김민재</button>
                    <button className="formChoicebtn1" style={{ marginLeft: 10, backgroundColor:"red"}} onClick={voteD} >황희찬</button>
                </div>
            </div>
        </>
        
    );
};
export default Vote1;