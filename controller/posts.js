const mongoose = require("mongoose");
const postMessage = require("../models/postMessage");

const gettPosts = async (req, res) => {
  try {
    const {page} =req.query
    const LIMIT = 8
    const startIndex = (Number(page) - 1)* LIMIT
    const totalPages = await postMessage.count({})
    const posts = await postMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
    res.status(200).json({data : posts, currentPage :Number(page),totalPages :Math.ceil(totalPages/LIMIT)});
  } catch (err) {
    res.status(404).json(err.message);
  }
};

const getPost = async(req,res) => {
  const {id} = req.params
  try{
    const post = await postMessage.findById(id)
    return res.status(200).json(post)
  } catch (err) {
    res.status(404).json(err.message);
  }
}

const getPostsBySearch = async(req,res) => {
  try{
    const {searchQuery,tags} = req.query
    const title = new RegExp(searchQuery,'i')
    const posts = await postMessage.find({$or:[{title},{tags:{$in:tags.split(',')}}]})
    res.json({data : posts})
  }catch(err){
    res.status(404).json(err.message);
  }
}

const createPosts = async (req, res) => {
  try {
    const post = req.body;
    const newPost = new postMessage({...post,creator: req.userId,createdAt :new Date().toISOString()});
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(404).json(err.message);
  }
};

const updatePosts = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No Post With that id");
    const postData = await postMessage.findById(_id)
    if(postData.creator === String(req.userId)){
      const updatedPost = await postMessage.findByIdAndUpdate(_id, {_id,...post}, {
        new: true,
      });
      res.status(200).json(updatedPost);
    }else{
      return res.json({message : 'Not authorized to update'})
    }
 
  } catch (e) {
    res.status(404).json(e.message);
  }
};

const deletePosts = async(req,res) => {
  try{
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Post With that id");
    const post = await postMessage.findById(_id)
    if(post.creator === String(req.userId)){
      await postMessage.findByIdAndRemove(_id)
      res.json('post deleted Succesfully')
    }else{
      return res.json({message : 'Not authorized to delete'})
    }
  }catch(e){
    res.status(404).json(e.message);
  }
}

const likePosts = async(req,res) => {
  try{
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) 
    return res.status(404).send("No Post With that id");
    const post = await postMessage.findById(_id)
    const index = post.likes.findIndex((id)=> id === String(req.userId))
    if(index === -1){
      post.likes.push(req.userId)
    }else{
      post.likes = post.likes.filter(id => id !== String(req.userId))
    }
    const updatedPost = await postMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.status(200).json(updatedPost);
  }catch(e){
    res.status(404).json(e.message);
  }
}

const commentPost = async(req,res) => {
  try {
    const {id} = req.params
    const {value} = req.body
    const post = await postMessage.findById(id)
    post.comments.push(value)
    const updatedPost = await postMessage.findByIdAndUpdate(id,post,{new:true})
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json(e.message);
  }
}

module.exports = {
  gettPosts,
  getPost,
  getPostsBySearch,
  createPosts,
  updatePosts,
  deletePosts,
  likePosts,
  commentPost
};
