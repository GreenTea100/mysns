import { dbService} from "fbase";
import React, {useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {updateDoc, doc, getDoc} from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApexChart from "react-apexcharts";
import Chart from "react-apexcharts";



const Vote3 = () => {

    const navigate = useNavigate();


    const [myvoteA, setMyvoteA] = useState([]);
    const [myvoteB, setMyvoteB] = useState([]);


    //파이어베이스 필드값 가져오는 함수
    const fetchData = async (e) => {
        try {
            const docRef = doc(dbService, "votes", "vote3");
            const docSnap = await getDoc(docRef);

            setMyvoteA(docSnap.data().countA);
            setMyvoteB(docSnap.data().countB);

            const voteObj = {
                conutA: myvoteA,
                countB: myvoteB,
            }
        }
        catch (e) {
            ;
        }
    };
    //바로 함수사용
    fetchData();

    //A투표카운트세는 변수 선언
    let numA = myvoteA;

    //B투표카운트세는 변수 선언
    let numB = myvoteB;


    //A에 투표하기
    const voteA = async(e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService,"votes",`vote3`),{
            countA: numA + 1
        });
        toast('투표 완료!');
    }

    //B에 투표하기
    const voteB = async (e) => {
        e.preventDefault();
        fetchData();
        await updateDoc(doc(dbService, "votes", `vote3`), {
            countB: numB + 1
        });
        toast('투표 완료!');
    }


    const golist = () =>{
        navigate('/vote');
    }
    
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
                limit={1} // 알람 개수 제한
            />
            <div className="container">
                <input type="text" value="당신의 최애에게 투표하세요" className="formTxtbox" style={{ marginBottom: 10 }} readOnly />
                <br></br>
                <div>
                    <label className="formBtn" onClick={golist}>뒤로가기</label>
                </div>
                <br></br><br></br><br></br>
                <label className="vote1Title">둘 중 더 최악의 이별은?</label>

                <ApexChart
                    type="bar"
                    series={[
                        { name: "환승이별", data: [numA] },
                        { name: "잠수이별", data: [numB] }
                    ]}
                    options={{
                        colors: ["yellowgreen", "darkgreen"],
                        chart: {
                            height: 350,
                            stacked: true,
                            stackType: '100%'
                          },
                          plotOptions: {
                            bar: {
                              borderRadius: 4,
                              horizontal: true,
                            }
                          },
                          xaxis: {
                            labels: {
                                show: false
                            },
                            show: false,
                            categories: [''
                            ],
                          },
                    }}
                />


                <div className="voteBtn">
                    <button className="formChoicebtn1" style={{ marginRight: 20, backgroundColor:"yellowGreen"}} onClick={voteA} >환승이별</button>
                    <button className="formChoicebtn1" style={{ marginLeft: 20, backgroundColor:"darkgreen"}} onClick={voteB} >잠수이별</button>
                </div>
            </div>
        </>
        
    );
};
export default Vote3;