import Kawaiinu from './kawaiinu';
import UploadBtn from './uploadBtn';
import styled from 'styled-components';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column; /* 위에서 아래로 배치 */
  justify-content: space-between; /* 콘텐츠와 푸터 사이 간격 유지 */
  height: 100vh; /* 화면 전체 높이 */
  padding-top: 100px; /* 헤더 높이만큼 추가 여백 */
  width: 100%;
  max-width: 860px;
  margin: 0 auto; /* 중앙 정렬 */
`;

const Header = styled.div`
  position: fixed; /* 상단 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 80px; /* 헤더 높이 */
  background-color: #f8f9fa; /* 헤더 배경색 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000; /* 다른 요소 위에 표시 */
`;

export default function MainpageHeader() {
    return (
        <>
        <Wrapper>
            <Header>
        <Kawaiinu/>
        <UploadBtn/>
        </Header>
        </Wrapper>
        </>
  
    );
}
