import styled from 'styled-components';
import kawaiinu from '../assets/kawaiinu.png';
const Wrapper = styled.div`
    margin-top: 50px;
`;

const KawaiinuImg = styled.img`
    height: 32px;
    cursor: pointer;
`;

export default function Kawaiinu() {
    return (
        <Wrapper>
            <KawaiinuImg src={kawaiinu} alt="kawaiinu" />
        </Wrapper>
    );
}
