import { useState } from 'react';
import { styled } from 'styled-components';
import { auth, db, storage } from '../firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'react-i18next';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid black;
    font-size: 16px;
    color: black;
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
    }
    &:focus {
        outline: none;
        border-color: #9bb4ff;
    }
`;

const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #9bb4ff;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #9bb4ff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

const SubmitBtn = styled.input<{ hasFile: boolean }>`
    background-color: ${(props) => (props.hasFile ? '#9bb4ff' : '#d3d3d3')}; /* 회색 (파일이 없을 경우) */
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: ${(props) => (props.hasFile ? 'pointer' : 'not-allowed')};
    &:hover,
    &:active {
        opacity: ${(props) => (props.hasFile ? 0.9 : 1)};
    }
`;

const AttachFileInput = styled.input`
    display: none;
`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1 && files[0].size <= 10000000) {
            setFile(files[0]);
        } else {
            alert("file's size is limit 1MB");
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        // 파일이 없으면 alert을 띄우고, 트윗을 게시하지 않음
        if (!file) {
            alert('Please upload a file before posting a tweet.');
            return;
        }

        if (!user || isLoading) {
            return;
        }
        try {
            setLoading(true);

            const doc = await addDoc(collection(db, 'tweets'), {
                tweet,
                createAt: Date.now(),
                username: user.displayName || 'Anonymous',
                userId: user.uid,
            });
            if (file) {
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                console.log('Photo uploaded to Storage, URL:', url);
                // Firestore 문서에 photo 필드 업데이트
                await updateDoc(doc, { photo: url });
                console.log('Firestore document updated with photo URL');

                //mysql에 사진정보 넣기
                const feedInfo = {
                    picture: doc.id,
                    userid: user.uid,
                };

                // POST 요청을 보냄
                const response = await fetch('http://192.168.0.248:8080/api/v1/feed/feedsave', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feedInfo),
                });
                if (!response.ok) {
                    setError(t('serverError'));
                    return;
                }
            }
            setTweet('');
            setFile(null);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Form onSubmit={onSubmit}>
            {/* <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening" /> */}
            <AttachFileButton htmlFor="file">{file ? 'Photo added ✅' : 'Add photo'}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
            <SubmitBtn
                type="submit"
                value={isLoading ? 'Posting...' : 'Post Tweet'}
                disabled={isLoading || !file}
                hasFile={!!file}
            />
        </Form>
    );
}
