import React from 'react';

// HorizonLineProps 인터페이스 정의
interface HorizonLineProps {
    text: string; // text는 반드시 string 타입이어야 함
}

// 함수형 컴포넌트 정의
const HorizonLine: React.FC<HorizonLineProps> = ({ text }) => {
    return (
        <div
            style={{
                width: '100%',
                textAlign: 'left',
                borderBottom: '1px solid black',
                lineHeight: '1em',
                margin: '10px 0 20px',
                display: 'block', // display를 block으로 설정하여 줄바꿈 유도
            }}
        >
            <span style={{ color: 'black', padding: '0 10px' }}>{text}</span>
        </div>
    );
};

export default HorizonLine;
