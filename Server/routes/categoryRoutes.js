const { addCategory, fetchAllCategories, fetchCategory, updateCategory, deleteCategory } = require("../controller/categoryController");

const router = require("express").Router();

router.route("/category")
.post(addCategory)
.get(fetchAllCategories);

router.route("/category/:id")
.get(fetchCategory)
.patch(updateCategory)
.delete(deleteCategory);

module.exports = router;