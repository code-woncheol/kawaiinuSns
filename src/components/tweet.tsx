import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState, useEffect } from 'react';
import Like from './like';
import Comment from './comment';
import { getDownloadURL } from 'firebase/storage';

const Actions = styled.div`
    display: flex;
    justify-content: flex-start; /* 왼쪽 정렬 */
    gap: 10px; /* 요소 간 간격 */
    margin-top: 10px; /* 위쪽에 간격을 추가 */
`;
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    border: 1px solid black;
`;
const Column = styled.div`
    width: 100%;
    display: flex; /* Flexbox를 사용하여 정렬 */
    flex-direction: column; /* 세로 방향 정렬 */
    justify-content: center; /* 세로 축 정렬 */
    align-items: center; /* 가로 축 정렬 */
    margin: auto;
`;
const Photo = styled.img`
    width: 95%;
    height: auto;
    border-radius: 15px;
`;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
    margin-left: 10px;
`;
const DeletButton = styled.label`
    width: 100px;
    text-align: center;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer; /* 클릭 가능하게 만듦 */

    svg {
        width: 24px; /* 아이콘 크기 조정 */
        margin: auto; /* 아이콘 중앙 정렬 */
    }

    /* Actions 컴포넌트 내에서 위치를 중앙에 맞추기 위해 수정 */
    margin-left: auto; /* 오른쪽 끝으로 정렬 */
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarUpload = styled.label`
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    background-color: #9bb4ff;
    cursor: pointer;
    display: flex;
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center; /* 수직 중앙 정렬 */

    svg {
        width: 24px; /* 원하는 크기로 설정 */
        height: 24px; /* 원하는 크기로 설정 */
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center; /* 세로로 중앙 정렬 */
    justify-content: flex-start; /* 왼쪽 정렬 */
    padding: 10px;
`;
export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState<string | null | undefined>(user?.photoURL);

    // user의 photoURL이 변경될 때마다 avatar 상태를 업데이트
    useEffect(() => {
        // userId에 해당하는 아바타 사진을 가져옴
        const avatarRef = ref(storage, `avatars/${userId}`);
        getDownloadURL(avatarRef)
            .then((url) => {
                setAvatar(url); // URL을 state로 설정
            })
            .catch((error) => {
                console.error('Error fetching avatar:', error);
            });
    }, [userId]); // userId가 변경될 때마다 아바타를 업데이트

    // 삭제 처리
    const onDelete = async () => {
        const ok = confirm('Are you sure you want to delete this tweet?');
        if (!ok || user?.uid !== userId) return; // feedId가 없으면 삭제하지 않음

        try {
            // Firebase에서 tweet 삭제
            await deleteDoc(doc(db, 'tweets', id));

            // 해당 tweet에 사진이 있을 경우 삭제
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);

                const response = await fetch('http://192.168.0.248:8080/api/v1/feed/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userid: userId,
                        feedid: id,
                    }),
                });

                if (response.ok) {
                    console.log('delete successfully');
                } else {
                    console.error('Failed to delete');
                }
            }
        } catch (e) {
            console.error('Error deleting tweet:', e);
        }
    };

    return (
        <Wrapper>
            {/* 왼쪽 영역: 사용자 프로필 이미지 */}
            <UserInfo>
                <AvatarUpload htmlFor="avatar">
                    {avatar ? (
                        <AvatarImg src={avatar} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="auto" fill="white">
                            <path
                                fillRule="evenodd"
                                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </AvatarUpload>
                {/* 오른쪽 영역: 사용자 이름 */}

                <Username>{username}</Username>
            </UserInfo>

            {/* 사진 영역: 사진이 있을 경우 사진 표시 */}
            <Column>{photo && <Photo src={photo} />}</Column>
            <Actions>
                <Like userId={userId} feedId={id} /> {/* feedId를 Like 컴포넌트에 전달 */}
                <Comment feedId={id} />
                {/* 버튼 영역: 삭제 버튼 (현재 사용자와 tweet 작성자가 일치할 경우만 표시) */}
                {user?.uid === userId && (
                    <DeletButton onClick={() => onDelete()}>
                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.0835 5.16663H19.7502L18.1042 19.9801C17.987 21.0351 17.0952 21.8333 16.0336 21.8333H6.80002C5.73845 21.8333 4.84666 21.0351 4.72943 19.9801L3.0835 5.16663Z"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M6.56745 2.19496C6.91136 1.46547 7.64539 1 8.45188 1H14.3811C15.1876 1 15.9216 1.46547 16.2656 2.19496L17.6665 5.16667H5.1665L6.56745 2.19496Z"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M1 5.16663H21.8333"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M9.3335 10.375V15.5833"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M13.5 10.375V15.5833"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </DeletButton>
                )}
            </Actions>
        </Wrapper>
    );
}
