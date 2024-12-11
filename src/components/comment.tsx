import { useState } from 'react';
import styled from 'styled-components';
import commentSVG from '../assets/comment.svg';
import { auth } from '../firebase';

const CommentButton = styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

const CommentContainer = styled.div`
    margin-top: 16px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

const CommentItem = styled.div`
    margin-bottom: 8px;
    padding: 8px;
    background-color: #f9f9f9;
    border-radius: 8px;
`;

const CommentForm = styled.form`
    margin-top: 8px;
    display: flex;
    flex-direction: column;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: none;
`;

const SubmitButton = styled.button`
    margin-top: 8px;
    padding: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

interface Comment {
    commentsid: string; // 댓글 ID
    usernickname: string; // 작성자 닉네임
    userid: string; // 작성자 ID
    feedid: string; // 피드 ID
    comments: string; // 댓글 내용
    commentsCreatedDate: string; // 작성 날짜
}

export default function Comment({ feedId }: { feedId: string }): JSX.Element {
    const [comments, setComments] = useState<Comment[]>([]); // 댓글 데이터 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [showComments, setShowComments] = useState(false); // 댓글 표시 여부
    const [newComment, setNewComment] = useState(''); // 새 댓글 입력 상태
    const userId = auth.currentUser?.uid || 'guestUser'; // 현재 사용자  guestUser는 추후에 삭제 예정

    // 피드 댓글 API 호출
    const fetchComments = async (): Promise<void> => {
        setLoading(true);
        try {
            // API 호출
            const response = await fetch('http://192.168.0.248:8080/api/v1/feed/getComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedid: feedId,
                }),
            });

            // 성공적으로 응답을 받은 경우 상태 변경
            if (response.ok) {
                const data = await response.json(); // API 응답 데이터
                console.log(data);
                setComments(data); // 상태 업데이트
            } else {
                console.error('Failed to fetch comments');
            }
        } catch (error) {
            console.error('Error while FeedCommentMove:', error);
        } finally {
            setLoading(false);
        }
    };

    // 댓글 저장 API 호출
    const postComment = async (): Promise<void> => {
        try {
            const response = await fetch('http://192.168.0.248:8080/api/v1/feed/commentsave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userId,
                    feedid: feedId,
                    comments: newComment,
                }),
            });

            if (response.ok) {
                console.log('Comment posted successfully');
                setNewComment(''); // 입력 필드 초기화
                fetchComments(); // 댓글 목록 다시 가져오기
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error while posting comment:', error);
        }
    };

    // 댓글 작성 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (newComment.trim() === '') {
            alert('댓글을 입력해주세요.');
            return;
        }
        postComment();
    };

    // 버튼 클릭 시 댓글 표시 토글 및 데이터 로드
    const handleToggleComments = (): void => {
        if (!showComments) {
            // 댓글이 처음 열릴 때만 API 호출
            fetchComments();
        }
        setShowComments(!showComments);
    };

    return (
        <div>
            <CommentButton
                src={commentSVG}
                alt={commentSVG}
                onClick={handleToggleComments} // 클릭 시 다시 댓글 가져오기
            />

            {/* 댓글 영역 */}
            {showComments && (
                <CommentContainer>
                    {loading ? (
                        <p>Loading comments...</p>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem key={comment.commentsid}>
                                <p style={{ fontSize: '0.8em', color: '#777' }}>
                                    {new Date(comment.commentsCreatedDate).toLocaleString()}
                                </p>
                                <p>
                                    <strong>{comment.usernickname}:</strong> {comment.comments}
                                </p>
                            </CommentItem>
                        ))
                    ) : (
                        <p>No comments available.</p>
                    )}

                    {/* 댓글 작성 폼 */}
                    <CommentForm onSubmit={handleSubmit}>
                        <TextArea
                            rows={3}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <SubmitButton type="submit">Submit</SubmitButton>
                    </CommentForm>
                </CommentContainer>
            )}
        </div>
    );
}
