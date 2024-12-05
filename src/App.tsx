import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout';
import Home from './routes/home';
import Profile from './routes/profile';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/loading-screen';
import { auth } from './firebase';
import ProtectedRoute from './components/protected-route';
import ResetPassword from './routes/reset-password';
import PetInfo from './routes/pet-info';
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'pet-info',
                element: <PetInfo />,
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/create-account',
        element: <CreateAccount />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
    },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  
  @font-face {
    font-family: 'SDSamliphopangche_Basic';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts-20-12@1.0/SDSamliphopangche_Basic.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
    @font-face {
  font-family: 'Noto Sans Japanese';
  font-style: normal;
  font-weight: 100;
  src: local('Noto Sans Japanese'),
       url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.woff2) format('woff2'),
       url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.woff) format('woff'),
       url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.otf) format('opentype');
}




  * {
    box-sizing: border-box;
    font-family: 'SDSamliphopangche_Basic','Noto Sans Japanese', sans-serif; /* 기본 폰트 설정 */


  }
  body{
    background-color: white;
    color: black;
    font-family: 'SDSamliphopangche_Basic','Noto Sans Japanese', sans-serif; /* 기본 폰트 설정 */

  }
    `;

const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    background-color: white;

    gap: 20px; /* 요소 간의 간격 조정 */
`;

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const init = async () => {
        await auth.authStateReady();
        setIsLoading(false);
        // setTimeout(() => setIsLoading(false), 2000);
    };
    useEffect(() => {
        init();
    }, []);
    return (
        <>
            <Wrapper>
                <GlobalStyles />
                {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
            </Wrapper>
        </>
    );
}

export default App;
