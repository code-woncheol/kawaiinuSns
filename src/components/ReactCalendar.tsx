import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios로 HTTP 요청
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import paw from '../assets/paw1.svg';
import { auth } from '../firebase';

// 캘린더 스타일링
const CustomCalendar = styled(Calendar)`
    /* 캘린더 전체 스타일 */
    border: none;
    width: 350px;
    max-width: 100%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;

    /* 네비게이션 영역 스타일 */
    .react-calendar__navigation {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .react-calendar__navigation button {
        color: #333;
        font-size: 16px;
        background: none;
        border: none;
        cursor: pointer;
    }

    .react-calendar__navigation button:hover {
        color: #007bff;
    }

    /* 요일 헤더 */
    .react-calendar__month-view__weekdays {
        text-transform: uppercase;
        font-weight: bold;
        color: #000;
        text-align: center;
    }

    .react-calendar__tile {
        position: relative; /* 타일을 기준으로 절대 위치 설정 */
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column; /* 이미지와 날짜를 세로로 정렬 */
    }

    .react-calendar__tile:hover {
        background: #ffd09b;
    }

    .react-calendar__tile--active {
        background: #ffd09b;
        color: #fff;
        font-weight: bold;
    }
    /* CSS 수정 */
    .attendance-icon {
        position: absolute; /* 부모 요소를 기준으로 위치 */
        bottom: 5px; /* 타일 하단에 위치 */
        left: 50%; /* 가로 중앙에 정렬 */
        transform: translateX(-50%); /* 중앙 정렬 보정 */
        width: 30px; /* 이미지 크기 조정 */
        height: 30px;
        opacity: 0.8; /* 투명도 */
        z-index: 10; /* 타일의 다른 콘텐츠 위에 표시 */
    }

    /* 오늘 날짜 스타일 */
    .react-calendar__tile--now {
        background: #ffeb3b;
        color: #333;
    }
    /* 타일 내부의 텍스트 정렬 조정 */
    .react-calendar__tile > span {
        margin-top: 5px; /* 이미지와 텍스트 간격 추가 */
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #f8f9fa;
`;
interface AttendanceEntry {
    isStrolled: string;
    strollDate: string;
}
export default function ReactCalendar() {
    const user = auth.currentUser;
    const [value, onChange] = useState<Date | null>(new Date());
    const [attendedDays, setAttendedDays] = useState<string[]>([]);

    const fetchAttendance = async () => {
        if (!user) return;

        try {
            const response = await axios.post('http://192.168.0.248:8080/api/v1/user/selectStroll', {
                userid: user.uid,
            });

            const attendedDates = response.data
                .filter((entry: AttendanceEntry) => entry.isStrolled === 'Y')
                .map((entry: AttendanceEntry) => {
                    const utcDate = new Date(entry.strollDate);
                    const localDate = new Date(utcDate.getTime() - 24 * 60 * 60 * 1000);
                    return localDate.toISOString().split('T')[0];
                });

            setAttendedDays(attendedDates);
        } catch (error) {
            console.error('출석 정보를 불러오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [user]);

    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const formattedDate = date.toISOString().split('T')[0];
            if (attendedDays.includes(formattedDate)) {
                return <img src={paw} alt="출석" className="attendance-icon" />;
            }
        }
        return null;
    };

    return (
        <Wrapper>
            <CustomCalendar
                value={value}
                tileContent={tileContent} // 출석 이미지 표시
                formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
                locale="ja-JP" // 일요일 시작
            />
        </Wrapper>
    );
}
