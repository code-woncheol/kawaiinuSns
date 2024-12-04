import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
const Button = styled.span`
    margin-top: 10px;
    background-color: white;
    font-weight: 600;
    width: 90%;
    color: black;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        color: #9bb4ff;
        opacity: 0.8;
    }
`;
const Logo = styled.img`
    height: 25px;
`;
export default function GithubButton() {
    const { t } = useTranslation(); // 다국어 지원을 위해 useTranslation 훅 사용
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const provieder = new GithubAuthProvider();
            await signInWithPopup(auth, provieder);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Button onClick={onClick}>
            <Logo src="/github-logo.svg" />
            {t('ContinuewithGithub')}
        </Button>
    );
}
