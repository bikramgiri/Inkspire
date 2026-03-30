const Category = require("../model/categoryModel");

// Add category
exports.addCategory = async (req, res) => {
      try {
            const { categoryName, categoryDescription } = req.body;

            // validate category length
            if (categoryName.length < 2 || categoryName.length > 20) {
                  return res.status(400).json({ 
                        message: 'Category name must be between 2 and 20 characters',
                        field: 'categoryName',
                  });
            }
            
            if (categoryDescription.length < 5 || categoryDescription.length > 300) {
                  return res.status(400).json({ 
                        message: 'Category description must be between 5 and 300 characters',
                        field: 'categoryDescription',
                  });
            }

            // category name should be unique
            const existingCategory = await Category.findOne({ categoryName });
            if (existingCategory) {
                  return res.status(400).json({ 
                        message: 'Category name already exists',
                        field: 'categoryName',
                  });
            }

            const category = await Category.create({
                  categoryName,
                  categoryDescription,
            });

            res.status(201).json({
                  message: 'Category added successfully',
                  data: category,
            });
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
      }
};

// Fetch all categories
exports.fetchAllCategories = async (req, res) => {
      try {
            const categories = await Category.find();
            
            res.status(200).json({
                  message: 'Categories fetched successfully',
                  count: categories.length,
                  data: categories,
            });
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
      }
};

// Fetch category 
exports.fetchCategory = async (req, res) => {
      try {
            const categoryId = req.params.id;
            if (!categoryId) {
                  return res.status(400).json({ 
                        message: 'Category ID is required',
                        field: 'id',
                  });
            }

            const category = await Category.findById(categoryId);
            if (!category) {
                  return res.status(404).json({
                        message: 'Category not found',
                        field: 'id',          
                  });
            }

            res.status(200).json({
                  message: 'Category fetched successfully',
                  data: category,
            });
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
      }
};

// Update category 
exports.updateCategory = async (req, res) => {
      try {
            const categoryId = req.params.id;
            if (!categoryId) {
                  return res.status(400).json({ 
                        message: 'Category ID is required',
                        field: 'id',
                  });
            }

            const { categoryName, categoryDescription } = req.body;

            // validate category length
            if (categoryName.length < 2 || categoryName.length > 20) {
                  return res.status(400).json({ 
                        message: 'Category name must be between 2 and 20 characters',
                        field: 'categoryName',
                  });
            }
            
            // validate category description length
            if (categoryDescription.length < 5 || categoryDescription.length > 300) {
                  return res.status(400).json({ 
                        message: 'Category description must be between 5 and 300 characters',
                        field: 'categoryDescription',
                  });
            }

            const category = await Category.findByIdAndUpdate(categoryId,{ 
                  categoryName, 
                  categoryDescription 
            }, { new: true }
            );

            if (!category) {
                  return res.status(404).json({
                        message: 'Category not found',
                        field: 'id',          
                  });
            }

            res.status(200).json({
                  message: 'Category updated successfully',
                  data: category,
            });
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
      }
};

// Delete category  
exports.deleteCategory = async (req, res) => {
      try {
            const categoryId = req.params.id;
            if (!categoryId) {
                  return res.status(400).json({ 
                        message: 'Category ID is required',
                        field: 'id',
                  });
            }

            const category = await Category.findByIdAndDelete(categoryId);
            if (!category) {
                  return res.status(404).json({
                        message: 'Category not found',
                        field: 'id',          
                  });
            }

            res.status(200).json({
                  message: 'Category deleted successfully',
            });
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
      }
};   





