import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import BACKEND_URL from "../config";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [courseOwner, setCourseOwner] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
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

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('courseOwner', courseOwner);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    if (logoFile) {
      data.set('logofile', logoFile[0]);  
    }

    try {
      const response = await fetch(`${BACKEND_URL}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form className="createPost" onSubmit={createNewPost} enctype="multipart/form-data">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        required
      />
      
     
      <input
        type="file"
        onChange={(ev) => setLogoFile(ev.target.files)}
      />

      <input
        type="text"
        placeholder="Course Owner"
        value={courseOwner}
        onChange={(ev) => setCourseOwner(ev.target.value)}
        required
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
        name="file"
        onChange={(ev) => setFiles(ev.target.files)}
        required
      />
      
     
      <Editor value={content} onChange={setContent} />

      <button type="submit" style={{ marginTop: '5px' }}>Create Post</button>
    </form>
  );
}
