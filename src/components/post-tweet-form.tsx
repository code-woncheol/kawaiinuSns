import { useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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

const SubmitBtn = styled.input`
    background-color: #9bb4ff;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

const AttachFileInput = styled.input`
    display: none;
`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState('');
    const [file, setFile] = useState<File | null>(null);
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
        if (!user || isLoading || tweet === '' || tweet.length > 180) {
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
                await updateDoc(doc, {
                    photo: url,
                });
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
            <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening" />
            <AttachFileButton htmlFor="file">{file ? 'Photo added ✅' : 'Add photo'}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
            <SubmitBtn type="submit" value={isLoading ? 'Posting...' : 'Post Tweet'} disabled={isLoading} />
        </Form>
    );
}
