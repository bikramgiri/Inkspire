const { addCategory, fetchAllCategories, fetchCategory, updateCategory, deleteCategory } = require("../../controller/category/categoryController");
const { upload } = require("../../middleware/multerConfig");
const catchError = require("../../services/catchError");

const router = require("express").Router();

router.route("/category")
.post(upload.single('categoryImage'), catchError(addCategory))
.get(catchError(fetchAllCategories));

router.route("/category/:id")
.get(catchError(fetchCategory))
.patch(upload.single('categoryImage'), catchError(updateCategory))
.delete(catchError(deleteCategory));

module.exports = router;