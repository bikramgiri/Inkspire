const Category = require("../../model/categoryModel");
const { deleteImageFromDisk } = require("../../services/helper");

// Add category
exports.addCategory = async (req, res) => {
  try {
    // *Multer
    // Handle image uploads
    if (!req.file) {
      return res.status(400).json({
        message: "Category image is required",
        field: "image",
      });
    }

    const categoryImageUrl = `${process.env.BACKEND_URL}/storage/${req.file?.filename}`;
    const categoryImage = req.file?.filename;

    const { categoryName, categoryDescription } = req.body;

    // validate category length
    if (categoryName.length < 2 || categoryName.length > 20) {
      return res.status(400).json({
        message: "Category name must be between 2 and 20 characters",
        field: "categoryName",
      });
    }

    if (categoryDescription.length < 5 || categoryDescription.length > 300) {
      return res.status(400).json({
        message: "Category description must be between 5 and 300 characters",
        field: "categoryDescription",
      });
    }

    // category name should be unique
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({
        message: "Category name already exists",
        field: "categoryName",
      });
    }

    // check categoryImage is already add or not
    const existingCategoryImage = await Category.findOne({
      categoryImage: categoryImage,
    });
    if (existingCategoryImage) {
      return res.status(400).json({
        message: "Category image already exists",
        field: "categoryImage",
      });
    }

    const category = await Category.create({
      categoryName,
      categoryImage,
      categoryDescription,
    });

    // image url
    const CategoryWithImageUrl = {
      ...category.toJSON(),
      categoryImageUrl,
    };

    res.status(201).json({
      message: "Category added successfully",
      data: CategoryWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all categories
exports.fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // Append full image URL to each category
    const categoriesWithImageUrl = categories.map((category) => ({
      ...category.toJSON(),
      categoryImageUrl: `${process.env.BACKEND_URL}/storage/${category.categoryImage}`,
    }));

    res.status(200).json({
      message: "Categories fetched successfully",
      count: categories.length,
      data: categoriesWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch category
exports.fetchCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
        field: "id",
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        field: "id",
      });
    }

    // Append full image URL to the category
    const categoryWithImageUrl = {
      ...category.toJSON(),
      categoryImageUrl: `${process.env.BACKEND_URL}/storage/${category.categoryImage}`,
    };

    res.status(200).json({
      message: "Category fetched successfully",
      data: categoryWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
        field: "id",
      });
    }

    // Fetch existing category first (needed for fallback image)
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        field: "id",
      });
    }

    const { categoryName, categoryDescription } = req.body;

    // validate category length
    if (categoryName.length < 2 || categoryName.length > 20) {
      return res.status(400).json({
        message: "Category name must be between 2 and 20 characters",
        field: "categoryName",
      });
    }

    // validate category description length
    if (categoryDescription.length < 5 || categoryDescription.length > 300) {
      return res.status(400).json({
        message: "Category description must be between 5 and 300 characters",
        field: "categoryDescription",
      });
    }

    // *For Multer:
    // Handle new image
    let newCategoryImageUrl;
    let newCategoryImage;
    if (req.file) {
      // New image uploaded — use it and delete the old one from disk
      newCategoryImageUrl = `${process.env.BACKEND_URL}/storage/${req.file?.filename}`;
      newCategoryImage = req.file?.filename;

      // Delete old image from disk
      deleteImageFromDisk(existingCategory.categoryImage);
    }
    // If no new image is uploaded, keep the existing image otherwise replace with new image
    else {
      newCategoryImageUrl = `${process.env.BACKEND_URL}/storage/${existingCategory.categoryImage}`;
      newCategoryImage = existingCategory.categoryImage; // fallback to existing image if no new image is uploaded
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName,
        categoryImage: newCategoryImage,
        categoryDescription,
      },
      { new: true },
    );
    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found",
        field: "id",
      });
    }

    // image url
    const CategoryWithImageUrl = {
      ...updatedCategory.toJSON(),
      categoryImageUrl: newCategoryImageUrl,
    };

    res.status(200).json({
      message: "Category updated successfully",
      data: CategoryWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
        field: "id",
      });
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        field: "id",
      });
    }

    // Delete image from disk after category is removed from DB
    deleteImageFromDisk(category.categoryImage);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
