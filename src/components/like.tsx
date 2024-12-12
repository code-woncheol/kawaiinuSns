import { useState, useEffect } from 'react';
import styled from 'styled-components';
import likeOnSVG from '../assets/like_on.svg';
import likeOffSVG from '../assets/like_off.svg';
import { auth, storage, db } from '../firebase';

interface LikeProps {
    userId: string;  // 사용자의 ID
    feedId: string;  // 피드(트윗) ID
}

// LikeButton 스타일 정의
const LikeButton = styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

export default function Like({ userId, feedId }: LikeProps): JSX.Element {
    const [isLiked, setIsLiked] = useState<boolean>(false);

    // 로그인한 사용자 ID 가져오기
    const currentUserId = auth.currentUser?.uid;

    // 좋아요 상태 토글 함수
    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                // API 호출하여 해당 피드에 대한 좋아요 상태 확인
                const response = await fetch('http://192.168.0.248:8080/api/v1/feed/feedSelectAll', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    // 해당 트윗(feedId)에 대해 사용자가 좋아요를 눌렀는지 확인
                    const likedFeed = data.find((feed: { likeUserId: string, likeFeedId: string, feedLike: boolean }) =>
                        feed.likeUserId === currentUserId && feed.likeFeedId === feedId
                    );

                    if (likedFeed) {
                        setIsLiked(likedFeed.feedLike);  // 피드의 좋아요 상태를 반영
                    } else {
                        setIsLiked(false);  // 좋아요 정보가 없으면 기본값 false
                    }
                } else {
                    console.error('Failed to fetch like status');
                }
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        // 컴포넌트가 렌더링될 때 API 호출
        if (currentUserId) {
            checkLikeStatus();
        }
    }, [currentUserId, feedId]); // currentUserId나 feedId가 변경될 때마다 실행

    // 좋아요 상태 토글 함수
    const toggleLike = async (): Promise<void> => {
        try {
            const response = await fetch('http://192.168.0.248:8080/api/v1/feed/toggleLike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: currentUserId,
                    feedid: feedId,
                }),
            });

            if (response.ok) {
                setIsLiked((prev) => !prev);  // 좋아요 상태를 토글
                console.log('Like status toggled');
            } else {
                console.error('Failed to toggle like');
            }
        } catch (error) {
            console.error('Error while toggling like:', error);
        }
    };

    return (
        <LikeButton
            src={isLiked ? likeOnSVG : likeOffSVG}  // 좋아요 상태에 따라 이미지 변경
            alt={isLiked ? 'Liked' : 'Not Liked'}  // 상태에 따라 alt 변경
            onClick={toggleLike}  // 클릭 시 상태 토글
        />
    );
}
