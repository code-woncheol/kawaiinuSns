import { useState } from 'react';
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { Error, Input, Swithcer, Wrapper } from '../components/auth-components';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
export default function ResetPassword() {
    const { t } = useTranslation(); // 다국어 지원을 위해 useTranslation 훅 사용
    const [email, setEmail] = useState<string>(''); // 이메일 입력 상태
    const [message, setMessage] = useState<string | null>(null); // 성공/오류 메시지
    const auth = getAuth();
    auth.languageCode = 'ko'; // 한국어 설정

    // 이메일 형식 검증 함수
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const sendResetEmail = async () => {
        if (!isValidEmail(email)) {
            setMessage(t('invalidEmailFormat'));
            return;
        }

        try {
            // 이메일이 등록된 사용자 목록을 확인
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);

            // 이미 존재하는 이메일인 경우
            if (signInMethods.length > 0) {
                // 비밀번호 재설정 이메일 전송
                await sendPasswordResetEmail(auth, email);
                setMessage(t('resetPasswordLinkSent', { email }));
            } else {
                setMessage(t('userNotRegistered'));
            }
        } catch (error: any) {
            // 다른 오류 처리
            setMessage(t('errorOccurred', { message: error.message }));
        }
    };

    return (
        <Wrapper>
            <h1>{t('resetPassword')}</h1>
            <Input
                type="email"
                placeholder={t('pleaseEnterYourEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input type="submit" onClick={sendResetEmail} value={t('resetYourPassword')}></Input>
            {message && <Error>{message}</Error>}
            <Swithcer>
                {t('backToLoginPage')} <Link to="/login">{t('logIn')} &rarr;</Link>{' '}
            </Swithcer>
        </Wrapper>
    );
}
