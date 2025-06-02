// pages/index.tsx

import { useEffect } from 'react';
import { fetchPosts, createPost } from '../../services/apiFunction';
import { useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    await createPost({
      title: 'New Post',
      body: 'This is a new post.',
      userId: 1,
    });
    loadPosts(); // refresh
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Posts</h1>
      <pre>{JSON.stringify(posts, null, 2)}</pre>

      <button onClick={handleCreate} style={{ marginTop: 20, padding: 10, background: 'green', color: 'white' }}>
        Create New Post
      </button>
    </div>
  );
}
