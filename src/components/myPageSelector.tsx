import React, { useState } from 'react';
import styled from 'styled-components';

import mmcalendar_on from '../assets/mmcalendar_on.png';
import mmcalendar_off from '../assets/mmcalendar_off.png';
import mmcalendar from '../assets/mmcalendar.png';
import mmalbum_on from '../assets/mmalbum_on.png';
import mmalbum_off from '../assets/mmalbum_off.png';
import mmalbum from '../assets/mmalbum.png';
import ReactCalendar from './ReactCalendar';
import AlbumGrid from './AlbumGrid';
import Album from './AlbumGrid';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 100vw;
    background-color: white;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
`;

const MenuImage = styled.img`
    height: 35px;
    margin: 0px 20px 0px 20px;
`;

export default function MyPageSelector() {
    const [isOn, setIsOn] = useState(true);
    const [isAon, setIsAOn] = useState(true);

    // 클릭 이벤트 핸들러
    const toggleImage = () => {
        setIsOn((prevState) => !prevState);
    };

    return (
        <Wrapper>
            <MenuItem>
                <MenuImage src={isOn ? mmcalendar_on : mmcalendar_off} alt="calendar menu" onClick={toggleImage} />
                <MenuImage src={isOn ? mmcalendar : mmalbum} alt="name" />
                <MenuImage src={!isOn ? mmalbum_on : mmalbum_off} alt="album menu" onClick={toggleImage} />
            </MenuItem>

            {/* 달력 부분 조건부 렌더링 원철 담당*/}
            {isOn && <ReactCalendar />}
            {/* 멍멍 앨범 부분 조건부 렌더링 선님 부탁드려요*/}
            {!isOn && <Album />}
        </Wrapper>
    );
}
