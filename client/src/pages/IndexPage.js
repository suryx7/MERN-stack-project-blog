import Post from "../components/Post";
import { useEffect, useState, useRef, useCallback } from "react";
import BACKEND_URL from "../config";
import '../styles/App.css';


export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); 
      try {
        const response = await fetch(`${BACKEND_URL}/post?page=${page}&limit=5`);
        const data = await response.json();

        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <div>
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          return (
            <div ref={lastPostElementRef} key={post._id}>
              <Post {...post} />
            </div>
          );
        } else {
          return (
            <div key={post._id}>
              <Post {...post} />
            </div>
          );
        }
      })}

      {loading &&
        Array.from({ length: 3 }).map((_, index) => (
          <div className="skeleton-post" key={index}>
            <div className="skeleton-image" />
            <div className="skeleton-texts">
              <div className="skeleton-title" />
              <div className="skeleton-summary" />
              <div className="skeleton-date" />
            </div>
          </div>
        ))}

      {!hasMore && !loading && (
        <p style={{ textAlign: "center" }}>No more posts to load.</p>
      )}
    </div>
  );
}
