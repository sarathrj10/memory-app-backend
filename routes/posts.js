const express = require('express')
const router = express.Router();
const {gettPosts,getPost,getPostsBySearch,createPosts,updatePosts,deletePosts,likePosts,commentPost} = require('../controller/posts')
const auth = require('../middleware/auth')

router.get('/search',getPostsBySearch)
router.get('/:id',getPost)
router.get('/',gettPosts)
router.post('/', auth,createPosts)
router.patch('/:id',auth,updatePosts)
router.delete('/:id',auth,deletePosts)
router.patch('/:id/likePost',auth,likePosts)
router.post('/:id/commentPost',auth,commentPost)

module.exports = router