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

const NameInput = styled.input`
    background-color: white;
    font-size: 22px;
    text-align: center;
    color: black;
    border: 1px solid black;
    border-radius: 15px;
`;

const ChangeNameBtn = styled.button`
    background-color: white;
    color: black;
    padding: 10px 5px;
    font-size: 15px;
    border-radius: 10px;
    border: 0.1px solid black;
    min-width: 110px;
`;

const Name = styled.span`
    font-size: 22px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #9bb4ff;
    cursor: pointer;
    display: flex;
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

const Tweets = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [name, setName] = useState(user?.displayName ?? 'Anonymous');
    const [editMode, setEditMode] = useState(false);

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
    }, []);
    return (
        <Wrapper>
            <MainpageHeader />
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
            {editMode ? (
                <NameInput onChange={onNameChange} type="text" value={name} />
            ) : (
                <Name>{name ?? 'Anonymous'}</Name>
            )}
            <ChangeNameBtn onClick={onChangeNameClick}>{editMode ? 'Save' : 'Change Name'}</ChangeNameBtn>
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
            <Menu />
        </Wrapper>
    );
}
