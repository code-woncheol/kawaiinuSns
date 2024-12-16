import Kawaiinu from './kawaiinu';
import UploadBtn from './uploadBtn';
import styled from 'styled-components';
const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0px;
    z-index: 1000;
    @media (max-width: 768px) {
        height: 60px;
        padding: 0 10px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    padding-top: 100px;
    width: 100%;
    max-width: 860px;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding-top: 80px;
    }
`;

export default function MainpageHeader() {
    return (
        <>
            <Wrapper>
                <Header>
                    <Kawaiinu />
                    <UploadBtn />
                </Header>
            </Wrapper>
        </>
    );
}