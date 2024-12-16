import { styled } from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useState, useEffect } from 'react';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';
import Menu from './home';
import MainpageHeader from '../components/mainPageHeader';
import pencil from '../assets/pencil.svg';
import MyPageSelector from '../components/myPageSelector';

const AvatarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); // 3개의 열로 설정
    gap: 15px; // 사진 간격 설정
    width: 90%; // 전체 영역 사용
    justify-content: center; // 각 셀의 내용을 중앙 정렬
    padding-bottom: 80px;
`;
const AvatarImgGrid = styled.img`
    width: 100%; // 그리드 셀 크기에 맞게 조정
    height: auto; // 비율 유지
    aspect-ratio: 1; // 정사각형 유지
    object-fit: cover; // 이미지 잘림 없이 채우기
    border-radius: 10px; // 이미지 테두리 둥글게
    border: 1px solid #ddd; // 테두리 색상 설정
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // 그림자 추가
`;

const NameWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px; /* 이름과 버튼 사이 간격 */
`;
const NameInput = styled.input`
    background-color: white;
    font-size: 22px;
    text-align: center;
    color: black;
    border: 1px solid black;
    border-radius: 15px;
`;

const ChangeNameBtn1 = styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

const Name = styled.span`
    font-size: 22px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding-top: 100px;
`;

const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #9bb4ff;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;

const AvatarImg = styled.img`
    width: 100%;
`;

const AvatarInput = styled.input`
    display: none;
`;

const BioWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const BioInput = styled.textarea`
    background-color: white;
    font-size: 18px;
    color: black;
    border: 1px solid black;
    border-radius: 10px;
    padding: 10px;
    width: 300px;
    height: 100px;
    resize: none;
`;

const Bio = styled.div`
    font-size: 18px;
`;

const Tweets = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto; /* 필요시 스크롤 활성화 */
    padding-bottom: 60px; /* 마지막 요소를 위한 여백 */
    box-sizing: border-box;
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [name, setName] = useState(user?.displayName ?? 'Anonymous');
    const [editMode, setEditMode] = useState(false);
    const [bioEditMode, setBioEditMode] = useState(false);
    const [bio, setBio] = useState<string>('');
    const [dogName, setDogName] = useState<string | null>(null); // 강아지 이름 상태
    const [dogAge, setDogAge] = useState<number | null>(null); /

    // 자기소개글 가져오기
    const fetchBio = async () => {
        if (!user) return;
        try {
            const apiURL = `http://192.168.0.248:8080/api/v1/user/userInfoSelect`;
            const requestBody = {
                useremail: user.email, // 임시 (이메일 불러와야함함)
            };
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            if (data && data[0]) {
                setBio(data[0].userintroduce || 'No bio yet');
            }
        } catch (error) {
            console.log('Error fetching bio:', error);
        }
    };

    const onChangeNameClick = async () => {
        if (!user) return;
        setEditMode((prev) => !prev);
        if (!editMode) return;
        try {
            await updateProfile(user, {
                displayName: name,
            });

            const nowUserId = user.uid;
            const apiURL = `http://192.168.0.248:8080/api/v1/user/${nowUserId}/nickname`;

            const requestBody = {
                newNickname: name,
            };

            const response = await fetch(apiURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Failed to update nickname: ${response.statusText}`);
            }

            console.log('Nickname updated successfully.');
        } catch (error) {
            console.log('Error updating nickname:', error);
        } finally {
            setEditMode(false);
        }
    };

    const onBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(event.target.value);
    };

    const onBioSave = async () => {
        if (!user) return;
        setBioEditMode(false);
        try {
            const nowUserId = user.uid;
            const apiURL = `http://192.168.0.248:8080/api/v1/user/introduce`;
            const requestBody = {
                userid: nowUserId,
                userintroduce: bio,
            };

            const response = await fetch(apiURL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Failed to update bio: ${response.statusText}`);
            }

            console.log('Bio updated successfully.');
        } catch (error) {
            console.log('Error updating bio:', error);
        }
    };

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user || !files || files.length !== 1) return;

        try {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, { photoURL: avatarUrl });
        } catch (error) {
            console.log('Error uploading avatar:', error);
        }
    };

    const fetchTweets = async () => {
        if (!user) return;

        try {
            const tweetQuery = query(
                collection(db, 'tweets'),
                where('userId', '==', user.uid),
                orderBy('createAt', 'desc'),
                limit(25),
            );

            const snapshot = await getDocs(tweetQuery);
            const tweets = snapshot.docs.map((doc) => {
                const { tweet, createAt, userId, username, photo } = doc.data();
                return { tweet, createAt, userId, username, photo, id: doc.id };
            });

            setTweets(tweets);
        } catch (error) {
            console.log('Error fetching tweets:', error);
        }
    };

    useEffect(() => {
        fetchTweets();
        fetchBio();
    }, []);
    return (
        <>
            <Wrapper>
                <AvatarUpload htmlFor="avatar">
                    {avatar ? (
                        <AvatarImg src={avatar} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                            <path
                                fillRule="evenodd"
                                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </AvatarUpload>
                <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
                <NameWrapper>
                    {editMode ? (
                        <NameInput onChange={onNameChange} type="text" value={name} />
                    ) : (
                        <Name>{name ?? 'Anonymous'}</Name>
                    )}
                    <ChangeNameBtn1 src={pencil} onClick={onChangeNameClick} />
                </NameWrapper>
                {/* <ChangeNameBtn onClick={onChangeNameClick}>{editMode ? 'Save' : 'Change Name'}</ChangeNameBtn> */}

                {/* 자기소개 여기 */}
                <BioWrapper>
                    {bioEditMode ? (
                        <>
                            <BioInput onChange={onBioChange} value={bio} />
                            <button onClick={onBioSave}>Save</button>
                        </>
                    ) : (
                        <Bio>{bio ?? 'No bio yet'}</Bio>
                    )}
                    <ChangeNameBtn1 src={pencil} onClick={() => setBioEditMode(!bioEditMode)} />
                </BioWrapper>

                <MyPageSelector />
                {/* <>
                    <Tweets>
                        {tweets.map((tweet) => (
                            <Tweet key={tweet.id} {...tweet} />
                        ))}
                    </Tweets>
                </> */}

                <AvatarGrid>
                    {tweets.map((tweet, index) => (
                        <AvatarImgGrid
                            key={index}
                            src={tweet.photo || 'https://via.placeholder.com/150'}
                            alt={`Tweet ${index + 1}`}
                        />
                    ))}
                </AvatarGrid>
            </Wrapper>
        </>
    );
}
