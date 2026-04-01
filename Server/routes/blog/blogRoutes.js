const { addBlog, fetchAllBlogs, fetchBlog, updateBlog, deleteBlog } = require("../../controller/blog/blogController");
const isAuthenticated = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/multerConfig");
const catchError = require("../../services/catchError");

const router = require("express").Router();

router.route("/blog")
.post(isAuthenticated, upload.single('image'), catchError(addBlog))
.get(catchError(fetchAllBlogs));

router.route("/blog/:id")
.get(catchError(fetchBlog))
.patch(isAuthenticated, upload.single('image'), catchError(updateBlog))
.delete(isAuthenticated, catchError(deleteBlog));



module.exports = router;