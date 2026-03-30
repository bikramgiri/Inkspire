const Blog = require("../model/blogModel");
const Category = require("../model/categoryModel");


// Add blog
exports.addBlog = async (req, res) => {
      try {
            const { title, description, category } = req.body;

            if (title.length < 5 || title.length > 30) {
                  return res.status(400).json({ 
                        message: 'Blog title must be between 5 and 30 characters',
                        field: 'title',
                  });
            }
            
            if (description.length < 5 || description.length > 3000) {
                  return res.status(400).json({ 
                        message: 'Blog description must be between 5 and 3000 characters',
                        field: 'description',
                  });
            }

            // title should be unique
            const existingBlog = await Blog.findOne({ title });
            if (existingBlog) {
                  return res.status(400).json({ 
                        message: 'Blog title already exists',
                        field: 'title',
                  });
            }

            const categoryId = await Category.findOne({ categoryName: category });
            if (!categoryId) {
                  return res.status(400).json({ 
                        message: 'Category not found',
                        field: 'category',
                  });
            }

            const blog = await Blog.create({
                  title,
                  description,
                  category: categoryId._id,
            });

            res.status(201).json({
                  message: 'Blog added successfully',
                  data: blog,
            });
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
      }
};
