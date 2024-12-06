import { useState } from 'react';
import styled from 'styled-components';
import likeOnSVG from '../assets/like_on.svg';
import likeOffSVG from '../assets/like_off.svg';
import { auth, storage, db } from '../firebase';
import firebase from 'firebase/compat/app';

// LikeButton 스타일 정의
const LikeButton = styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

export default function Like({ userId, feedId }: LikeProps): JSX.Element {
    const [isLiked, setIsLiked] = useState<boolean>(false);

    userId = auth.currentUser?.uid;

    // 좋아요 상태 토글 함수
    const toggleLike = async (): Promise<void> => {
        try {
            // API 호출
            const response = await fetch('http://192.168.0.248:8080/api/v1/feed/toggleLike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userId,
                    feedid: feedId,
                }),
            });

            // 성공적으로 응답을 받은 경우 상태 변경
            if (response.ok) {
                setIsLiked((prev) => !prev);
            } else {
                console.error('Failed to toggle like');
            }
        } catch (error) {
            console.error('Error while toggling like:', error);
        }
    };

    return (
        <LikeButton
            src={isLiked ? likeOnSVG : likeOffSVG} // 좋아요 상태에 따라 다른 이미지 표시
            alt={isLiked ? 'Liked' : 'Not Liked'} // 상태에 따라 alt 변경
            onClick={toggleLike} // 클릭 시 상태 토글
        />
    );
}
