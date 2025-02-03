import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { format } from "date-fns";

export default function SearchHandlingPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (query) => {
    if (!query) return;

    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const response = await fetch(`http://localhost:4050/search?query=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const results = await response.json();
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="searchResult">Search Results</h1>

      {loading && <h2 className="searchResult loading">Loading...</h2>}
      {error && <p className="error">{error}</p>}

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((post) => {
            return (
              <div className="post" key={post._id}>
                {post.cover && (
                  <div className="image">
                    <Link to={`/post/${post._id}`}>
                      <img
                        src={`http://localhost:4050/${post.cover}`}
                        alt={post.title || "Post cover"}
                        loading="lazy"
                      />
                    </Link>
                  </div>
                )}

                <div className="texts">
                  <Link to={`/post/${post._id}`}>
                    <h2>{post.title}</h2>
                  </Link>

                  <p className="info">
                    <Link to={`/post/${post._id}`} className="logofile">
                      <img  
                        src={`http://localhost:4050/${post.logofile}`} 
                        alt={post.title || "logofile"} 
                        className="logofile-img"
                      />
                    </Link>
                    <span className="postcourseOwner">{post.courseOwner || "No Course Owner"}</span>
                  </p>

                  <p className="summary">{post.summary}</p>
                  <time className="postTime">{format(new Date(post.createdAt), 'yyyy-MM-dd')}</time> 
                </div>
              </div>
            );
          })
        ) : (
          !loading &&
          !error && (
            <h2 className="searchResult no-results">
              No results found. Please try a different search.
            </h2>
          )
        )}
      </div>
    </div>
  );
}
