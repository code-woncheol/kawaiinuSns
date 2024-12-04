import BackBtn from './backBtn';
import { Title } from './auth-components';
import styled from 'styled-components';
import HorizonLine from './horizonline';

// AddpageHeader 스타일 정의
const HeaderContainer = styled.header`
    display: flex;
    flex-direction: column; /* 세로로 정렬하여 요소들이 아래로 쌓이게 함 */
    align-items: center; /* 중앙 정렬 */
    width: 100%;
    padding: 10px 20px;
`;
const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between; /* BackBtn을 왼쪽, Title을 중앙으로 배치 */
    align-items: center;
    width: 100%;
`;

// title에 대한 타입을 string으로 지정
interface AddpageHeaderProps {
    title: string; // title은 반드시 string 타입이어야 함
}

export default function AddpageHeader({ title }: AddpageHeaderProps) {
    return (
        <HeaderContainer>
            <HeaderRow>
                <BackBtn />
                <Title>{title}</Title>
            </HeaderRow>
            <HorizonLine text="회원 정보 입력" />
        </HeaderContainer>
    );
}
