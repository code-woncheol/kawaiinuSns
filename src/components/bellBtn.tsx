import styled from 'styled-components';
import bell from '../assets/bell.svg';
import check from '../assets/check.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Wrapper = styled.div`
    position: relative; /* 자식 요소의 absolute 기준을 잡기 위해 필요 */
    display: inline-block; /* 버튼 크기에 맞게 wrapping */
    margin-top: 20px;
    left: 85%;
    position: fixed;
    top: 0; /* 하단 위치 */
`;

const BellButton = styled.img`
    width: 24px;
    height: 24px;
`;

const BellButtonCircle = styled.div`
    width: 24px;
    height: 24px;
    position: absolute;
    top: 15px;
    left: 15px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NotificationCount = styled.div`
    position: absolute;
    top: -5px; /* 체크 아이콘의 위쪽 위치 */
    right: 5px; /* 체크 아이콘의 오른쪽 위치 */
    background-color: #ffd09b;
    color: white;
    border-radius: 50%;
    padding: 5px;
    font-size: 12px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const BellBtn = () => {
    const navigate = useNavigate();
    const [alarmCount, setAlarmCount] = useState(0);

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchAlarmCount = async () => {
            try {
                const response = await fetch('http://192.168.0.248:8080/api/v1/alarm/alarmCount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userid: userId }),
                });

                const data = await response.json();
                setAlarmCount(data);
            } catch (error) {
                console.error('알람 갯수 조회 실패:', error);
            }
        };

        fetchAlarmCount();
        // 알람 갯수를 10초마다 조회
        const intervalId = setInterval(fetchAlarmCount, 5000); // 10초마다 호출

        console.log('리로딩');
        // 컴포넌트가 언마운트될 때 interval 정리
        return () => {
            clearInterval(intervalId);
        };
    }, [userId]);

    const handleBellClick = () => {
        navigate('/alarm');
    };

    return (
        <Wrapper>
            <BellButton src={bell} alt={'bell'} onClick={handleBellClick} />
            <BellButtonCircle>
                {alarmCount > 0 ? (
                    <NotificationCount onClick={handleBellClick}>{alarmCount}</NotificationCount> // 알람 갯수 표시
                ) : (
                    <img src={check} alt={'check'} />
                )}
            </BellButtonCircle>
        </Wrapper>
    );
};

export default BellBtn;
