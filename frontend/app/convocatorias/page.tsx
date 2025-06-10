// app/convocatorias/page.tsx
'use client'; // Necesario para componentes que usan hooks de React

import { useState, useEffect, ChangeEvent } from 'react'; // Importa ChangeEvent
import styles from './page.module.css'; // Todo el CSS estará aquí
import Footer from '../components/organism/Footer';
import Header from '../components/organism/Header';

// Definición de las interfaces para los datos de los posts
interface Post {
  id: string;
  text: string;
  likes: number;
  author: string;
  location?: string;
  imageUrl?: string;
  comments?: number;
  authorAvatar?: string;
}

export default function ConvocatoriasPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para el componente de creación de posts
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Simular carga de posts desde el backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simular un retraso para la carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));

        // Datos simulados (mock data) para las publicaciones
        const mockPosts: Post[] = [
          {
            id: 'post-1',
            author: 'Evelyn on Vacation',
            authorAvatar: '/avatars/evelyn.jpg', // Avatar de ejemplo
            location: 'Bali, Indonesia',
            text: 'Life is better by the pool :) Enjoying sunset together with @Andrew',
            likes: 37,
            comments: 12,
            imageUrl: '/images/sunset-pool.png', // Imagen de ejemplo
          },
          {
            id: 'post-2',
            author: 'Happy Chrissy',
            authorAvatar: '/avatars/chrissy.jpg', // Avatar de ejemplo
            text: 'Let me share with you today my thoughts on happiness. The problem is that we constantly seek new experiences, on every adventure our mind responds with new wishes. We always want something more and better. But happiness lies in not needing more',
            likes: 15,
            comments: 5,
          },
        ];

        setPosts(mockPosts);
      } catch (err) {
        setError('No se pudo conectar al servidor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handler para dar "like" a un post
  const handleLike = async (postId: string) => {
    // En una aplicación real, esto sería una llamada a la API
    setPosts(posts.map((post: Post) => // Tipado explícito aquí
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
    console.log(`Liked post: ${postId}`);
  };

  // Handler para la subida de imágenes en el creador de posts
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => { // Tipado explícito aquí
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // En una aplicación real, subirías este archivo a un servidor
      // y obtendrías una URL. Por ahora, usamos la Data URL.
    } else {
      setImagePreview(null);
    }
  };

  // Handler para enviar un nuevo post
  const handleSubmitNewPost = () => {
    if (postText.trim() || imagePreview) {
      const newPost: Post = {
        id: `new-post-${Date.now()}`,
        author: 'You', // O el nombre del usuario logueado
        authorAvatar: '/avatars/default-user.jpg', // Avatar por defecto para nuevos posts
        text: postText.trim(),
        likes: 0,
        comments: 0,
        imageUrl: imagePreview || undefined,
        location: 'Current Location (Optional)', // Podrías añadir un input para esto
      };
      setPosts([newPost, ...posts]); // Añadir el nuevo post al inicio
      setPostText(''); // Limpiar el texto
      setImagePreview(null); // Limpiar la previsualización de la imagen
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {/* Sección de Historias (Stories) */}
        <div className={styles.storiesContainer}>
          {/* Aquí irían las historias dinámicas. Por ahora, solo representaciones estáticas. */}
          <div className={styles.story}>
            <img src="/avatars/user1.jpg" alt="User 1" className={styles.storyAvatar} />
            <span className={styles.storyName}>User 1</span>
          </div>
          <div className={styles.story}>
            <img src="/avatars/user2.jpg" alt="User 2" className={styles.storyAvatar} />
            <span className={styles.storyName}>User 2</span>
          </div>
          <div className={styles.story}>
            <img src="/avatars/user3.jpg" alt="User 3" className={styles.storyAvatar} />
            <span className={styles.storyName}>User 3</span>
          </div>
          <div className={styles.story}>
            <img src="/avatars/user4.jpg" alt="User 4" className={styles.storyAvatar} />
            <span className={styles.storyName}>User 4</span>
          </div>
          <div className={styles.story}>
            <img src="/avatars/user5.jpg" alt="User 5" className={styles.storyAvatar} />
            <span className={styles.storyName}>User 5</span>
          </div>
        </div>

        {/* Sección para Crear Publicación (consolidada aquí) */}
        <div className={styles.createPostContainer}>
          <div className={styles.profilePic}>
            <img src="/avatars/default-user.jpg" alt="Profile" className={styles.avatar} />
          </div>
          <div className={styles.inputArea}>
            <textarea
              placeholder="What would you like to share?"
              value={postText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPostText(e.target.value)} // Tipado explícito aquí
              className={styles.postInput}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Post preview" className={styles.uploadedImage} />
                <button className={styles.removeImageButton} onClick={() => setImagePreview(null)}>X</button>
              </div>
            )}
            <div className={styles.actionsRow}>
              <label htmlFor="imageUpload" className={styles.iconButton}>
                📸 Foto/Video
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <button onClick={handleSubmitNewPost} className={styles.postButton}>
                Publicar
              </button>
            </div>
          </div>
        </div>

        {/* Listado de Publicaciones */}
        {isLoading ? (
          <p>Cargando posts...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.postsContainer}>
            {posts.map((post: Post) => ( // Tipado explícito aquí
              <div key={post.id} className={styles.post}>
                <div className={styles.postHeader}>
                  <img src={post.authorAvatar || '/avatars/default.jpg'} alt={post.author} className={styles.postAvatar} />
                  <div className={styles.postInfo}>
                    <p className={styles.postAuthor}>{post.author}</p>
                    {post.location && <p className={styles.postLocation}>{post.location}</p>}
                  </div>
                </div>
                <p className={styles.postText}>{post.text}</p>
                {post.imageUrl && (
                  <div className={styles.postImageContainer}>
                    <img src={post.imageUrl} alt="Post content" className={styles.postImage} />
                  </div>
                )}
                <div className={styles.postActionsSummary}>
                  <div className={styles.likesCount}>👍 {post.likes}</div>
                  <div className={styles.commentsCount}>{post.comments} comentarios</div>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleLike(post.id)}
                    className={styles.likeButton}
                  >
                    👍 Me gusta
                  </button>
                  <button className={styles.commentButton}>💬 Comentar</button>
                  <button className={styles.shareButton}>↩️ Compartir</button>
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