import LogoutBtn from '../components/logout';
import MainpageFooter from '../components/mainPageFooter';
import MainpageHeader from '../components/mainPageHeader';
import PostTweetForm from '../components/post-tweet-form';
import Timeline from '../components/timeline';
import { styled } from 'styled-components';

const Wrapper = styled.div`
`;

export default function Home() {
    console.log('Home component is rendering'); // 렌더링 확인용 콘솔 로그
    return (
        <>
                  <MainpageHeader/>
        <Wrapper>
            <PostTweetForm />
            <Timeline />
        </Wrapper>
        </>
    );
}
