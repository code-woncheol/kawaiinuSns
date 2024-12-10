import LogoutBtn from '../components/logout';
import MainpageFooter from '../components/mainPageFooter';
import MainpageHeader from '../components/mainPageHeader';
import PostTweetForm from '../components/post-tweet-form';
import Timeline from '../components/timeline';
import { styled } from 'styled-components';

const Wrapper = styled.div`
    display: grid;
    gap: 50px;
    overflow-y: scroll;
    grid-template-rows: 1fr 5fr;
`;

export default function Home() {
    console.log('Home component is rendering'); // 렌더링 확인용 콘솔 로그
    return (
        <Wrapper>
            <MainpageHeader />
            <PostTweetForm />
            <Timeline />
        </Wrapper>
    );
}
