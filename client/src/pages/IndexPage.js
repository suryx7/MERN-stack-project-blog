import Post from "../components/Post";
import { useEffect, useState, useRef, useCallback } from "react";
import BACKEND_URL from "../config";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
      try {
        const response = await fetch(`${BACKEND_URL}/post?page=${page}&limit=5`);
        const data = await response.json();

        setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Correct response handling
        setHasMore(data.hasMore); // Update hasMore based on backend response
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <>
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
      {!hasMore && <p style={{ textAlign: "center" }}>No more posts to load.</p>}
    </>
  );
}
