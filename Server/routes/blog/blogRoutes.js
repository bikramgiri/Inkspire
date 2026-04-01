const { addBlog, fetchAllBlogs, fetchBlog, updateBlog, deleteBlog } = require("../../controller/blog/blogController");
const { upload } = require("../../middleware/multerConfig");
const catchError = require("../../services/catchError");

const router = require("express").Router();

router.route("/blog")
.post(upload.single('image'), catchError(addBlog))
.get(catchError(fetchAllBlogs));

router.route("/blog/:id")
.get(catchError(fetchBlog))
.patch(upload.single('image'), catchError(updateBlog))
.delete(catchError(deleteBlog));



module.exports = router;