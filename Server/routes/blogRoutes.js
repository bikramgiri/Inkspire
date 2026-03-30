const { addBlog } = require("../controller/blogController");

const router = require("express").Router();

router.route("/blog").post(addBlog)

module.exports = router;