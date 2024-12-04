import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
    Error,
    Form,
    Input,
    Swithcer,
    Title,
    Wrapper,
    GenderSelector,
    RadioLabel,
    RadioInput,
    AgeSelector,
} from '../components/auth-components';
import GithubButton from '../components/github-btn';
import 'react-datepicker/dist/react-datepicker.css';

import { useTranslation } from 'react-i18next';
import AddpageHeader from '../components/addPageHeader';

export default function CreateAccount() {
    const navigate = useNavigate();
    const { t } = useTranslation(); // 다국어 지원을 위해 useTranslation 훅 사용
    const [isLoading, setLoading] = useState(false);
    // const [name, SetName] = useState('');

    const [nickname, SetNickName] = useState('');
    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');
    const [passwordCheck, SetPasswordCheck] = useState('');
    const [error, setError] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true); // 패스워드 일치 여부 상태 추가

    // event 매개변수에 타입을 명시합니다.
    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value);
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (
            isLoading ||
            // name === '' ||
            nickname === '' ||
            email === '' ||
            password === '' ||
            passwordCheck === ''
        )
            return;
        if (password !== passwordCheck) {
            setError(t('passwordMismatch')); // 패스워드 불일치 시 에러 메시지
            return;
        }
        try {
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);
            await updateProfile(credentials.user, {
                displayName: nickname,
            });
            // 유저 정보를 API에 전송
            const userInfo = {
                usernickname: nickname,
                userage: age,
                usergender: gender,
                useremail: email,
            };

            // POST 요청을 보냄
            const response = await fetch('http://192.168.0.248:8080/api/v1/user/userentry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });

            if (!response.ok) {
                setError(t('serverError'));
                return;
            }
            navigate('/pet-info');
            //
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            } else {
                setError(t('registrationError'));
            }
            console.log(e);
            //setError
        } finally {
            setLoading(false);
        }
        console.log(nickname, email, password);
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === 'name') {
            // SetName(value);
        } else if (name === 'email') {
            SetEmail(value);
        } else if (name === 'password') {
            SetPassword(value);
        } else if (name === 'passwordCheck') {
            SetPasswordCheck(value);
            // 패스워드와 확인 패스워드 비교
            setPasswordMatch(value === password);
        } else if (name === 'nickname') {
            SetNickName(value);
        }
    };
    return (
        <Wrapper>
            <AddpageHeader title={t('joinKawaiinu')} />
            {/* <BackBtn />
            <Title>{t('joinKawaiinu')}</Title> */}
            <Form onSubmit={onSubmit}>
                {/* <Input name="name" onChange={onChange} value={name} placeholder={t('name')} type="text" required /> */}
                <Input name="email" onChange={onChange} value={email} placeholder={t('email')} type="email" required />
                <Input
                    name="password"
                    onChange={onChange}
                    value={password}
                    placeholder={t('password')}
                    type="password"
                    required
                />
                <Input
                    name="passwordCheck"
                    onChange={onChange}
                    value={passwordCheck}
                    placeholder={t('passwordCheck')}
                    type="password"
                    required
                />
                {!passwordMatch && passwordCheck !== '' && (
                    <Error
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                    >
                        {t('passwordMismatch')}
                    </Error>
                )}{' '}
                <Input
                    name="nickname"
                    onChange={onChange}
                    value={nickname}
                    placeholder={t('nickname')}
                    type="text"
                    required
                />
                <AgeSelector>
                    <RadioLabel>
                        <RadioInput
                            required
                            type="radio"
                            name="age"
                            value="10"
                            checked={age === '10'}
                            onChange={handleAgeChange}
                        />
                        10대
                        <RadioInput
                            type="radio"
                            name="age"
                            value="20"
                            checked={age === '20'}
                            onChange={handleAgeChange}
                        />
                        20대
                        <RadioInput
                            type="radio"
                            name="age"
                            value="30"
                            checked={age === '30'}
                            onChange={handleAgeChange}
                        />
                        30대
                        <RadioInput
                            type="radio"
                            name="age"
                            value="40"
                            checked={age === '40'}
                            onChange={handleAgeChange}
                        />
                        40대 이상
                    </RadioLabel>
                </AgeSelector>
                <GenderSelector>
                    <RadioLabel>
                        <RadioInput
                            required
                            type="radio"
                            name="gender"
                            value="male"
                            checked={gender === 'male'}
                            onChange={handleGenderChange}
                        />
                        Male
                    </RadioLabel>
                    <RadioLabel>
                        <RadioInput
                            type="radio"
                            name="gender"
                            value="female"
                            checked={gender === 'female'}
                            onChange={handleGenderChange}
                        />
                        Female
                    </RadioLabel>
                </GenderSelector>
                <Input type="submit" value={isLoading ? t('loading') : t('createAccount')} />
            </Form>
            {error !== '' ? <Error>{error}</Error> : null}
            <Swithcer>
                {t('alreadyHaveAccount')} <Link to="/login">{t('logIn')} &rarr;</Link>
            </Swithcer>
            <GithubButton />
        </Wrapper>
    );
}
