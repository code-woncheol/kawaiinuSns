import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import backBtnImg from '../assets/backBtn.svg';

export default function BackBtn() {
    // Styled-component로 이미지 스타일 정의
    const BackButton = styled.img`
        width: 40px;
        height: 40px;
        cursor: pointer; /* 클릭 가능한 버튼 느낌 추가 */
    `;

    const navigate = useNavigate();

    const onClick = () => {
        try {
            navigate(-1); // 직전 페이지로 이동
        } catch (error) {
            console.error('Navigation Error:', error);
        }
    };

    return (
        // BackButton 컴포넌트에 이미지 소스와 클릭 핸들러 연결
        <BackButton src={backBtnImg} alt="Back" onClick={onClick} />
    );
}
