import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import BACKEND_URL from "../config";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [logofile, setLogofile] = useState("");
  const [courseOwner, setCourseOwner] = useState("");
  const [redirect, setRedirect] = useState(false);
  
  
  useEffect(() => {
    fetch(`${BACKEND_URL}/post/${id}`)
    .then((response) => response.json())
    .then((postInfo) => {
      setTitle(postInfo.title);
      setCourseOwner(postInfo.courseOwner);
      setContent(postInfo.content);
      setSummary(postInfo.summary);
    });
  }, [id]);
  
  const wordLimit = 100;
  const handleSummaryChange = (ev) => {
    const inputSummary = ev.target.value;
    const wordCount = inputSummary.trim() ? inputSummary.trim().split(/\s+/).length : 0;
    if (wordCount <= wordLimit) {
      setSummary(inputSummary);
    }
  };

  const countWords = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("courseOwner", courseOwner);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);

  
    if (files?.[0]) {
      data.set("file", files?.[0]); 
    }
    if (logofile?.[0]) {
      data.set("logofile", logofile?.[0]); 
    }

    const response = await fetch(`${BACKEND_URL}/post/${id}`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form className="createPost" onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
        <input
          type="file"
          onChange={(ev) => setLogofile(ev.target.files)}
        />
      <input
        type="text"
        placeholder="Course Owner"
        value={courseOwner}
        onChange={(ev) => setCourseOwner(ev.target.value)}
      />
      <div className="textarea-container">
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={handleSummaryChange}
          rows="3"
          required
          className="summary-textarea"
        ></textarea>
        <p className="word-count">
          Word Count: {countWords(summary)} / {wordLimit}
        </p>
      </div>
      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)} 
      />
      <Editor onChange={setContent} value={content} className='ql-editor' />
      <button style={{ marginTop: "5px" }}>Update course info</button>
    </form>
  );
}
