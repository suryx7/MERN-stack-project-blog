const fs = require('fs');
const Post = require('../models/Post');
const path = require("path");

const createPost = async (req, res) => {
  try {
    const coverFile = req.files.file ? req.files.file[0] : null;
    const logoFile = req.files.logofile ? req.files['logofile'][0] : null;


    let logoPath = "uploads/logos/default-logo.png";
    const { originalname, path } = coverFile;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext; 
    fs.renameSync(path, newPath);

    if (logoFile) {
      const logoExt = logoFile.originalname.split('.').pop();
      logoPath = `${logoFile.path}.${logoExt}`; 
      fs.renameSync(logoFile.path, logoPath);
 
    };


    
    const { title, courseOwner, summary, content } = req.body;
    
    const postDoc = await Post.create({
      title,
      courseOwner,
      summary,
      content,
      cover : newPath, 
      logofile: logoPath, 
      author: req.user.id,
    });

    res.status(201).json(postDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updatePost = async (req, res) => {
  try {
    const { id, title, courseOwner, summary, content } = req.body;


    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }


    let newLogoPath = postDoc.logofile;

    
    let newPath = null;
    const file = req.files.file ? req.files.file[0] : null;
    if (file) {
      const {originalname,path} = file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
  }

    if (req.files['logofile']) {
      const logoFile = req.files['logofile'][0];
      const logoExt = logoFile.originalname.split('.').pop();
      newLogoPath = `${logoFile.path}.${logoExt}`;
      fs.renameSync(logoFile.path, newLogoPath);
    }

   
    await postDoc.updateOne({
      title,
      courseOwner,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
      logofile: newLogoPath,
    });

    res.status(200).json(postDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      
    const limit = parseInt(req.query.limit) || 5;    
    const skip = (page - 1) * limit;                 

    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })                       
      .skip(skip)                                   
      .limit(limit);                                
    const totalPosts = await Post.countDocuments();  
    const hasMore = skip + posts.length < totalPosts; 

    res.json({ posts, hasMore });  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getPostById = async (req, res) => {
  try {
    const postDoc = await Post.findById(req.params.id).populate('author', 'username');
    res.json(postDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchPosts = async (req, res) => {
  const { query } = req.query;

  try {
    const queryFilter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { courseOwner: { $regex: query, $options: 'i' } },
      ],
    };

    const posts = await Post.find(queryFilter);


    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



const DeletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findById(id);

    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (postDoc.cover && fs.existsSync(postDoc.cover)) {
      fs.unlinkSync(postDoc.cover);
    }

    if (
      postDoc.logofile && 
      fs.existsSync(postDoc.logofile) && 
      path.basename(postDoc.logofile) !== "default-logo.png"
    ) {
      fs.unlinkSync(postDoc.logofile);
    }
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post and associated files deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};




module.exports = {
  createPost,
  updatePost,
  getPosts,
  getPostById,
  searchPosts,
  DeletePost,
};
