import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LabelList, Label } from "recharts";
import {updateDoc, doc, getDoc} from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const Vote2 = () => {
    const navigate = useNavigate();
    const [myvoteA, setMyvoteA] = useState([]);
    const [myvoteB, setMyvoteB] = useState([]);
    const [myvoteC, setMyvoteC] = useState([]);
    const [myvoteD, setMyvoteD] = useState([]);
    const [myvoteE, setMyvoteE] = useState([]);
    const [myvoteF, setMyvoteF] = useState([]);
    const [myvoteG, setMyvoteG] = useState([]);
    const [myvoteH, setMyvoteH] = useState([]);
    const [myvoteI, setMyvoteI] = useState([]);


    //파이어베이스 필드값 가져오는 함수
    const fetchData = async (e) => {
        try {
            const docRef = doc(dbService, "votes", "vote2");
            const docSnap = await getDoc(docRef);

            setMyvoteA(docSnap.data().countA);
            setMyvoteB(docSnap.data().countB);
            setMyvoteC(docSnap.data().countC);
            setMyvoteD(docSnap.data().countD);
            setMyvoteE(docSnap.data().countE);
            setMyvoteF(docSnap.data().countF);
            setMyvoteG(docSnap.data().countG);
            setMyvoteH(docSnap.data().countH);
            setMyvoteI(docSnap.data().countI);

            const voteObj = {
                conutA: myvoteA,
                countB: myvoteB,
                countC: myvoteC,
                countD: myvoteD,
                countE: myvoteE,
                countF: myvoteF,
                countG: myvoteG,
                countH: myvoteH,
                countI: myvoteI,
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

    //D투표카운트세는 변수 선언
    let numD = myvoteD;
    
    //E투표카운트세는 변수 선언
    let numE = myvoteE;
    
    //F투표카운트세는 변수 선언
    let numF = myvoteF;

    //G투표카운트세는 변수 선언
    let numG = myvoteG;

    //H투표카운트세는 변수 선언
    let numH = myvoteH;

    //I투표카운트세는 변수 선언
    let numI = myvoteI;




    //A에 투표하기
    const voteA = async(e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService,"votes",`vote2`),{
            countA: numA+1
        });
        toast('투표 완료!');
    }

    //B에 투표하기
    const voteB = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countB: numB + 1
        });
        toast('투표 완료!');
    }

    //C에 투표하기
    const voteC = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countC: numC + 1
        });
        toast('투표 완료!');
    }

    //D에 투표하기
    const voteD = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countD: numD + 1
        });
        toast('투표 완료!');
    }

    //E에 투표하기
    const voteE = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countE: numE + 1
        });
        toast('투표 완료!');
    }

    //F에 투표하기
    const voteF = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countF: numF + 1
        });
        toast('투표 완료!');
    }

    //G에 투표하기
    const voteG = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countG: numG + 1
        });
        toast('투표 완료!');
    }

    //H에 투표하기
    const voteH = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countH: numH + 1
        });
        toast('투표 완료!');
    }

    //I에 투표하기
    const voteI = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote2`), {
            countI: numI + 1
        });
        toast('투표 완료!');
    }


    const golist = () =>{
        navigate('/vote');
    }
    
    //막대바 데이터
    const data = [
        {
            육개장: numA,
            신라면: numB,
            불닭볶음면: numC,
            너구리: numD,
            짜파게티: numE,
            안성탕면: numF,
            진라면: numG,
            삼양라면: numH,
            튀김우동: numI,

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
                <label className="vote1Title">최애 라면은?</label>


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
                    <Bar barSize={30} dataKey="육개장" fill="YellowGreen">
                        <LabelList dataKey="육개장" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="신라면" fill="Lightskyblue">
                        <LabelList dataKey="신라면" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="불닭볶음면" fill="Orange">
                        <LabelList dataKey="불닭볶음면" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="너구리" fill="thistle">
                        <LabelList dataKey="너구리" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="짜파게티" fill="darkolivegreen">
                        <LabelList dataKey="짜파게티" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="안성탕면" fill="tomato">
                        <LabelList dataKey="안성탕면" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="진라면" fill="cornflowerblue">
                        <LabelList dataKey="진라면" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="삼양라면" fill="indigo">
                        <LabelList dataKey="삼양라면" position="top" />
                    </Bar>
                    <Bar barSize={30} dataKey="튀김우동" fill="mediumseagreen">
                        <LabelList dataKey="튀김우동" position="top" />
                    </Bar>
                </BarChart>


                <div className="voteBtn">
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"yellowGreen"}} onClick={voteA} >육개장</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"Lightskyblue"}} onClick={voteB} >신라면</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"Orange"}} onClick={voteC} >불닭볶음면</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"thistle"}} onClick={voteD} >너구리</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"darkolivegreen"}} onClick={voteE} >짜파게티</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"tomato"}} onClick={voteF} >안성탕면</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"cornflowerblue"}} onClick={voteG} >진라면</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"indigo"}} onClick={voteH} >삼양라면</button>
                    <button className="formChoicebtn2" style={{ marginLeft: 10, backgroundColor:"mediumseagreen"}} onClick={voteI} >튀김우동</button>
                </div>
            </div>
        </>
        
    );
};
export default Vote2;