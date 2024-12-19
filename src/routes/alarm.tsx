import { auth, db, storage } from '../firebase';
import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
    display: flex; /* 수평 배치 */
    flex-direction: column; /* 세로로 배치 */
    justify-content: flex-start; /* 알람을 위로 정렬 */
    align-items: center; /* 중앙 정렬 */
    position: fixed; /* 화면에 고정 */
    top: 100px; /* 화면 상단에 고정 */
    left: 0;
    right: 0;
    z-index: 10; /* 다른 요소들보다 위에 보이도록 설정 */
    background-color: #fff; /* 배경색 설정 */
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    width: 100%;
    max-height: 600px; /* 알람 영역의 최대 높이 설정 */
    overflow-y: auto; /* 알람이 많으면 세로 스크롤이 가능하게 설정 */
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: center; /* 제목을 가로로 가운데 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    width: 100%;
    margin-bottom: 10px;
`;

const AlarmContainer = styled.div`
    display: flex;
    flex-direction: column; /* 세로로 배치 */
    justify-content: flex-start; /* 알람을 위로 정렬 */
    align-items: flex-start; /* 왼쪽 정렬 */
    margin-right: 20px; /* 버튼과의 간격 */
`;

const AlarmItem = styled.div`
    margin-right: 20px; /* 항목 간의 간격 */
    padding: 10px;
    background-color: #f4f4f4;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    line-height: 1.5;
    width: auto; /* 기본 크기 */
    min-width: 300px; /* 최소 크기 설정 */
    word-wrap: break-word;
`;

const AlarmText = styled.div`
    font-weight: bold;
    white-space: normal; /* 텍스트 줄바꿈 허용 */
    word-wrap: break-word; /* 긴 단어가 자동으로 줄바꿈 되게 */
    line-height: 1.5; /* 줄 간격 설정 */
    max-width: 300px; /* 알람 텍스트 영역 크기 제한 (필요시 조정) */
`;

const AlarmDate = styled.div`
    color: gray;
    font-size: 12px;
`;

const MarkAsReadButton = styled.button`
    background-color: #4caf50; /* 버튼 색상 */
    color: white;
    border: none;
    padding: 5px 5px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: gray; /* 호버 효과 */
    }
`;

export default function alarm() {
    const [alarms, setAlarms] = useState([]);
    const userId = auth.currentUser?.uid; // 이 부분은 실제 로그인된 사용자 ID로 바꿔주세요

    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const response = await fetch('http://192.168.0.248:8080/api/v1/alarm/mySelectAlarm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userid: userId }),
                });

                const data = await response.json();
                setAlarms(data); // 알람 데이터를 상태에 저장
            } catch (error) {
                console.error('알람 데이터 조회 실패:', error);
            }
        };

        fetchAlarms(); // 컴포넌트 렌더링 후 알람 데이터 가져오기
    }, [userId]);

    const getAlarmMessage = (alarm) => {
        // likeOrComment가 'C'일 경우 "댓글", 'L'일 경우 "좋아요" 처리
        const action = alarm.likeOrComment === 'C' ? '댓글' : alarm.likeOrComment === 'L' ? '좋아요' : '';
        return `${alarm.otherusernickname}님이 ${alarm.usernickname}님의 게시글에 ${action}을 남겼습니다.`;
    };

    // 알람을 모두 읽음 처리하는 함수
    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch('http://192.168.0.248:8080/api/v1/alarm/alarmCheckAll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: userId }),
            });

            if (response.ok) {
                console.log('알람 확인 처리 완료');
                // 알람 확인 처리가 완료되면 알람 상태를 갱신할 수 있습니다.
                setAlarms(alarms.map((alarm) => ({ ...alarm, readYN: 'Y' }))); // 상태 업데이트
            } else {
                console.error('알람 확인 처리 실패');
            }
        } catch (error) {
            console.error('알람 확인 요청 실패:', error);
        }
    };

    return (
        <Wrapper>
            <TitleContainer>
                <h2>회원님의 알람</h2>
                <MarkAsReadButton onClick={handleMarkAllAsRead}>모든 알람 읽음 처리</MarkAsReadButton>
            </TitleContainer>

            <AlarmContainer>
                {alarms.length > 0 ? (
                    alarms.map((alarm) => (
                        <AlarmItem key={alarm.alarmid}>
                            <AlarmText>{getAlarmMessage(alarm)}</AlarmText>
                            <AlarmDate>{new Date(alarm.createDate).toLocaleString()}</AlarmDate>
                        </AlarmItem>
                    ))
                ) : (
                    <div>알람이 없습니다.</div>
                )}
            </AlarmContainer>
        </Wrapper>
    );
}
