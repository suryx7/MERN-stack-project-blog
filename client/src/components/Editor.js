import React, { useRef } from "react";
import ReactQuill from "react-quill";
import 'quill-image-resize-module-react';
import { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

import ImageResize from "quill-image-resize-module-react"; 

Quill.register("modules/imageResize", ImageResize);

export default function Editor({ value, onChange }) {
  const quillRef = useRef(null);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 
    'indent', 'link', 'image', 'align', 'font', 'size', 'color', 'background', 'script'
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }], 
      ['bold', 'italic', 'underline', 'strike'], 
      ['blockquote'], 
      [{ list: 'ordered' }, { list: 'bullet' }], 
      [{ indent: '-1' }, { indent: '+1' }], 
      ['link', 'image'], 
      [{ align: [] }], 
      [{ font: [] }], 
      [{ size: ['small', 'medium', 'large', 'huge'] }], 
      [{ color: [] }, { background: [] }], 
      [{ script: 'sub' }, { script: 'super' }], 
      ['clean'], 
    ],
    imageResize: {
      modules: ['Resize', 'DisplaySize', 'Toolbar'],
    },
  };

  return (
    <div className="content">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        theme="snow"
        modules={modules}
        formats={formats} 
        placeholder="Write something amazing..."
      />
    </div>
  );
}
