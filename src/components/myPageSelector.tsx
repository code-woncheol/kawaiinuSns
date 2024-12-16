import React, { useState } from 'react';
import styled from 'styled-components';

import mmcalendar_on from '../assets/mmcalendar_on.png';
import mmcalendar_off from '../assets/mmcalendar_off.png';
import mmcalendar from '../assets/mmcalendar.png';
import mmablum_on from '../assets/mmalbum_on.png';
import mmablum_off from '../assets/mmalbum_off.png';
import mmablum from '../assets/mmalbum.png';

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
    justify-content: center; /* 텍스트/이미지가 가운데 정렬되도록 추가 */
    height: 50px;
    width: 100vh;
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

    // 클릭 이벤트 핸들러
    const toggleImage = () => {
        setIsOn((prevState) => !prevState);
    };

    return (
        <Wrapper>
            <MenuItem>
                <MenuImage src={isOn ? mmcalendar_on : mmcalendar_off} alt="menu" onClick={toggleImage} />
                <MenuImage src={isOn ? mmcalendar : mmablum} alt="name" />
                <MenuImage src={isOn ? mmablum_off : mmablum_on} alt="icon" onClick={toggleImage} />
            </MenuItem>
        </Wrapper>
    );
}
