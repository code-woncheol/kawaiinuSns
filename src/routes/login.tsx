import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
// import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Form, Error, Input, Swithcer, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-btn';
import { useTranslation } from 'react-i18next';

export default function CreateAccount() {
    const navigate = useNavigate();
    const { t } = useTranslation(); // 다국어 지원을 위해 useTranslation 훅 사용
    const [isLoading, setLoading] = useState(false);
    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (isLoading || email === '' || password === '') return;

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
            //
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
            console.log(e);
            //setError
        } finally {
            setLoading(false);
        }
        console.log(name, email, password);
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === 'email') {
            SetEmail(value);
        } else if (name === 'password') {
            SetPassword(value);
        }
    };
    return (
        <Wrapper>
            <Title>{t('logIntoKawaiinu')}</Title>
            <Form onSubmit={onSubmit}>
                <Input name="email" onChange={onChange} value={email} placeholder={t('email')} type="email" required />
                <Input
                    name="password"
                    onChange={onChange}
                    value={password}
                    placeholder={t('password')}
                    type="password"
                    required
                />
                <Input type="submit" value={isLoading ? t('loading') : t('logIn')} />
            </Form>

            {error !== '' ? <Error>{error}</Error> : null}

            <Swithcer>
                {t('dontHaveAccount')} <Link to="/create-account">{t('createAccount')} &rarr;</Link>
            </Swithcer>
            <Swithcer>
                {t('forgotYourPassword')} <Link to="/reset-password">{t('resetPassword')} &rarr;</Link>
            </Swithcer>
            <GithubButton />
        </Wrapper>
    );
}
