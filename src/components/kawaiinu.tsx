import React, { useState } from 'react';
import styled from 'styled-components';
import kawaiinu from '../assets/kawaiinu.png';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
    position: relative; /* MenuItem의 기준이 되는 컨테이너 */
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const KawaiinuImg = styled.img`
    height: 28px;
    cursor: pointer;
`;

const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 120px;
    margin-top: 0px; /* KawaiinuImg와 버튼 사이 간격 */
    background-color: #d9d9d9;
    border-radius: 20px;
    position: absolute; /* 절대 위치 설정 */
    top: 40px; /* KawaiinuImg 아래로 배치 */
    z-index: 1; /* 다른 요소 위로 표시 */

    svg {
        width: 30px;
        fill: none;

        path {
            stroke: tomato;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
    }
    &.log-out {
        svg {
            fill: tomato;
        }
    }
    span {
        font-size: 16px;
        color: black; /* 텍스트 색상 */
        font-weight: bold;
    }
`;
export default function Kawaiinu() {
    const [showLogout, setShowLogout] = useState(false); // log-out 버튼 상태
    const navigate = useNavigate();

    const toggleLogoutButton = () => {
        setShowLogout((prev) => !prev); // 상태를 토글
    };

    const onLogOut = async () => {
        const ok = confirm('Are you sure you want to log out?');
        if (ok) {
            await auth.signOut();
            navigate('/login');
        }
    };

    return (
        <Wrapper>
            {/* 로그아웃 버튼 표시 여부를 토글하는 이미지 */}
            <KawaiinuImg src={kawaiinu} alt="kawaiinu" onClick={toggleLogoutButton} />

            {/* 상태에 따라 log-out 버튼 표시 */}
            {showLogout && (
                <MenuItem className="log-out" onClick={onLogOut}>
                    <span>로그아웃</span>
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                        />
                        <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
                        />
                    </svg>
                </MenuItem>
            )}
        </Wrapper>
    );
}
