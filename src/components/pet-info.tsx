import { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { GenderSelector, Input, Title, Wrapper } from './auth-components';
import { useTranslation } from 'react-i18next';
import { getAuth } from 'firebase/auth';
import { Error, RadioInput, RadioLabel } from '../components/auth-components';
import axios from 'axios';

export default function PetInfo() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const [petName, setPetName] = useState('');
    const [breed, setBreed] = useState('');
    const [yearOfBirth, setYearOfBirth] = useState('');
    const [weight, setWeight] = useState('');
    const [favSnack, setFavSnack] = useState('');
    const [error, setError] = useState('');
    const [petgender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [nickname, SetNickName] = useState('');

    const auth = getAuth();

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!auth.currentUser) {
            return;
        }

        e.preventDefault();
        if (isLoading || 
            petName === '' || 
            breed === '' || 
            yearOfBirth === '' || 
            weight === '' || 
            favSnack === '') 
            return;
            
        
        
        try {
            setLoading(true);

            const nowUserId = auth.currentUser?.uid;

            //유저 정보를 API에 전송
            const petInfo = {
                useremail: auth.currentUser?.email,
                petname: petName,
                petbreed: breed,
                petage: yearOfBirth,
                petweight: weight,
                petsnack: favSnack,
                petgender: petgender
                
            };

            //POST 요청을 보냄
            const response = await fetch('http://192.168.0.248:8080/api/v1/user/petentry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(petInfo),
            });
            if (!response.ok) {
                setError(t('severError'));
                return;
            }
            navigate('/');
            //
        } catch (e) {
        } finally {
            setLoading(false);
        }
        console.log(petName, breed, yearOfBirth, weight, favSnack, petgender);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === 'petName') {
            setPetName(value);
        } else if (name === 'breed') {
            setBreed(value);
        } else if (name === 'yearOfBirth') {
            setYearOfBirth(value);
        } else if (name === 'weight') {
            setWeight(value);
        } else if (name === 'favSnack') {
            setFavSnack(value);
        } else if (name == 'nickname') {
            SetNickName(value);
        }
    };
    return (
        <Wrapper>
            <Title>{t('Add Pet Information')}</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    name="petName"
                    onChange={onChange}
                    value={petName}
                    placeholder={'이름 입력'}
                    type="text"
                    required
                />
                <Input name="breed" onChange={onChange} value={breed} placeholder={'종류 입력'} type="text" required />
                <Input
                    name="yearOfBirth"
                    onChange={onChange}
                    value={yearOfBirth}
                    placeholder={'태어난 년도 입력'}
                    type="text"
                    required
                />
                <Input
                    name="weight"
                    onChange={onChange}
                    value={weight}
                    placeholder={'무게 입력'}
                    type="text"
                    required
                />
                <Input
                    name="favSnack"
                    onChange={onChange}
                    value={favSnack}
                    placeholder={'좋아하는 간식 입력'}
                    type="text"
                    required
                />
                <Input 
                    name="nickname"
                    onChange={onChange}
                    value={nickname}
                    placeholder={t('nickname')}
                    type='txt'
                    required/>
                <GenderSelector>
                <RadioLabel>
                    <RadioInput 
                        required 
                        type="radio" 
                        name="petGender" 
                        value="male" 
                        checked={petgender === 'male'}
                        onChange={handleGenderChange} 
                    />
                    남아
                    <RadioInput
                        required
                        type="radio"
                        name="petGender"
                        value="female"
                        checked={petgender === 'female'}
                        onChange={handleGenderChange}
                    />
                    여아
                </RadioLabel>
                </GenderSelector>  
                <Input type="submit" value={isLoading ? 'loading' : '확인'} />
            </Form>
        </Wrapper>
    );
}
