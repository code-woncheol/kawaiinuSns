import { useState } from 'react';
import styled from 'styled-components';
import camera from '../assets/camera.svg';
import plusCircle from '../assets/plus-circle.svg';
import { addDoc, collection } from 'firebase/firestore';
import { storage, auth, db } from '../firebase'; // firebase storage import
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Wrapper = styled.div`
    position: relative; /* 자식 요소의 absolute 기준을 잡기 위해 필요 */
    display: inline-block; /* 버튼 크기에 맞게 wrapping */
    margin-top: 20px;
    left: 75%;
    position: fixed;
    top: 0; /* 하단 위치 */
`;

const UploadButton = styled.img`
    width: 24px;
    height: 24px;
`;

const UploadButtonCircle = styled.img`
    width: 18px;
    height: 18px;
    position: absolute; /* 상대 위치를 기준으로 겹침 */
    top: 15px; /* camera 버튼의 위쪽에 겹침 */
    left: 15px; /* camera 버튼의 왼쪽에 겹침 */
    cursor: pointer;
`;

const HiddenInput = styled.input`
    display: none;
`;

const UploadBtn = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setLoading] = useState(false);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1 && files[0].size <= 10000000) {
            // Size limit
            setFile(files[0]);
            handleFileUpload(files[0]);
        } else {
            alert("File's size is limited to 10MB");
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('Please log in first');
                return;
            }

            // Firebase Storage reference
            const locationRef = ref(storage, `tweets/${user.uid}/${file.name}`);
            const result = await uploadBytes(locationRef, file);
            const url = await getDownloadURL(result.ref);

            // Firestore 문서에 photo 필드 업데이트
            const doc = await addDoc(collection(db, 'tweets'), {
                createAt: Date.now(),
                username: user.displayName || 'Anonymous',
                userId: user.uid,
                photo: url,
            });
            console.log('File uploaded and Firestore document updated with photo URL:', url);

            // Optional: Save photo information to MySQL
            const feedInfo = {
                picture: '',
                userid: user.uid,
                feedid: doc.id,
            };

            const response = await fetch('http://192.168.0.248:8080/api/v1/feed/feedsave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedInfo),
            });

            if (!response.ok) {
                alert('Error saving feed information');
            }
        } catch (e) {
            console.error(e);
            alert('File upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <UploadButton src={camera} alt={'camera'} />
            <UploadButtonCircle
                src={plusCircle}
                alt={'plus-circle'}
                onClick={() => document.getElementById('file-input')?.click()}
            />
            <HiddenInput type="file" id="file-input" onChange={onFileChange} />
        </Wrapper>
    );
};

export default UploadBtn;
