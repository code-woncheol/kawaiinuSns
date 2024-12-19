import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { ITweet } from '../components/timeline';

const AlbumGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    width: 90%;
    justify-content: center;
    padding-bottom: 80px;
`;

const AlbumImgGrid = styled.img`
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default function Album() {
    const user = auth.currentUser;
    const [tweets, setTweets] = useState<ITweet[]>([]);

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
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                fetchTweets();
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AlbumGrid>
            {tweets.map((tweet, index) => (
                <AlbumImgGrid
                    key={index}
                    src={tweet.photo || 'https://via.placeholder.com/150'}
                    alt={`Tweet ${index + 1}`}
                />
            ))}
        </AlbumGrid>
    );
}
