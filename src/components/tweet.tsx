import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

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
    &:last-child {
        place-self: end;
    }
`;
const Photo = styled.img`
    width: 90%;
    height: auto;
    border-radius: 15px;
`;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;
const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;
const Payload_edit = styled.textarea`
    margin: 10px 0px;
    font-size: 18px;
    width: 100%;
    height: auto;
`;

const DeletButton = styled.button`
    background-color: #ff6f61;
    width: 100px;
    text-align: center;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;
const EditButton = styled.button`
    background-color: #9bb4ff;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [editedTweet, setEditedTweet] = useState(tweet);

    const onEdit = () => {
        if (user?.uid === userId) {
            setIsEditing((prev) => !prev); // isEditing 상태 토글
        }
    };

    const handleSaveEdit = async () => {
        try {
            await updateDoc(doc(db, 'tweets', id), { tweet: editedTweet });
            setIsEditing(false);
        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedTweet(event.target.value);
    };

    const onDelete = async () => {
        const ok = confirm('Are you sure you want to delete this tweet?');
        if (!ok || user?.uid !== userId) return;

        try {
            await deleteDoc(doc(db, 'tweets', id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Wrapper>
            {/* 왼쪽 영역 */}
            <Column>
                <Username>{username}</Username>
                {isEditing ? (
                    <Payload_edit value={editedTweet} onChange={handleChange} onBlur={handleSaveEdit} autoFocus />
                ) : (
                    <Payload>{tweet}</Payload>
                )}
            </Column>

            {/* 오른쪽 영역: 사진 표시 */}
            <Column>{photo && <Photo src={photo} />}</Column>

            {/* 버튼 영역 */}
            {user?.uid === userId && <DeletButton onClick={onDelete}>Delete</DeletButton>}
        </Wrapper>
    );
}
