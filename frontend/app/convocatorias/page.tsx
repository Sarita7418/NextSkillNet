'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Footer from '../components/organism/Footer';
import Header from '../components/organism/Header';

interface Post {
  id: string;
  text: string;
  likes: number;
  author: string;
}

export default function ConvocatoriasPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Simular carga de posts desde el backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/posts');
        const data = await response.json();
        if (response.ok) {
          setPosts(data);
        } else {
          setError('Error al cargar posts');
        }
      } catch (err) {
        setError('No se pudo conectar al servidor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/like`, {
        method: 'POST',
      });
      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
      }
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <h1>Convocatorias</h1>
        
        {isLoading ? (
          <p>Cargando posts...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.postsContainer}>
            {posts.map(post => (
              <div key={post.id} className={styles.post}>
                <p className={styles.author}>{post.author}</p>
                <p className={styles.text}>{post.text}</p>
                <div className={styles.actions}>
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={styles.likeButton}
                  >
                    👍 {post.likes}
                  </button>
                  <button className={styles.commentButton}>💬 Comentar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}