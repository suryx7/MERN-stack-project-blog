import { format } from 'date-fns';
import { Link } from "react-router-dom";
import BACKEND_URL from '../config';

export default function Post({ _id, title, courseOwner, summary, cover, createdAt, logofile }) {

  return (
    <div className="post">
      {cover && (
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img
              src={`${BACKEND_URL}/${cover}`}
              alt={title || "Post cover"}
            />
          </Link>
        </div>
      )}
      

      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <Link to={`/post/${_id}`} className="logofile">
          <img  
            src={`${BACKEND_URL}/${logofile}`} 
            alt={title || "logofile"} 
            className="logofile-img"
          />
        </Link>

          <span className="postcourseOwner">{courseOwner}</span>
        </p>

        <p className="summary">{summary}</p>
          <time className='postTime'>{format(new Date(createdAt), 'yyyy-MM-dd')}</time>
      </div>
    </div>
  );
}
