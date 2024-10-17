import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/Posts?page=${page}&pageSize=10`);
            setPosts(prevPosts => [...prevPosts, ...response.data]);
            setHasMore(response.data.length > 0);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div>
            {posts.map(post => (
                <div key={post.guid}>
                    <h2>{post.title}</h2>
                    <p>Wallet ID: {post.walletId}</p>
                    <div>
                        {post.tags.map(tag => (
                            <span key={tag.id} style={{ marginRight: '5px' }}>{tag.name}</span>
                        ))}
                    </div>
                </div>
            ))}
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default Posts;