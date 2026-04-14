const Blog = require("../../model/blogModel");
const Category = require("../../model/categoryModel");
const { deleteImageFromDisk } = require("../../services/helper");

// Add blog
exports.addBlog = async (req, res) => {
  try {
    // *Multer
    if (!req.file) {
      return res.status(400).json({
        message: "Blog image is required",
        field: "image",
      });
    }

    const imageUrl = `${process.env.BACKEND_URL}/storage/${req.file?.filename}`;
    const image = req.file?.filename;

    const { title, description, category } = req.body;

    if (title.length < 5 || title.length > 100) {
      return res.status(400).json({
        message: "Blog title must be between 5 and 100 characters",
        field: "title",
      });
    }

    if (description.length < 5 || description.length > 8000) {
      return res.status(400).json({
        message: "Blog description must be between 5 and 8000 characters",
        field: "description",
      });
    }

    // title should be unique
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({
        message: "Blog title already exists",
        field: "title",
      });
    }

    const categoryDoc = await Category.findOne({ categoryName: category });
    if (!categoryDoc) {
      return res.status(400).json({
        message: "Category not found",
        field: "category",
      });
    }

    const blog = await Blog.create({
      title,
      image,
      author: req.user._id, 
      description,
      category: categoryDoc._id,
    });

    // image url
    const blogWithImageUrl = {
      ...blog.toJSON(),
      imageUrl,
      category: categoryDoc.categoryName
    };

    res.status(201).json({
      message: "Blog added successfully",
      data: blogWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all blogs
exports.fetchAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
    .populate("category")
    .populate("author", "username avatar"); // populate author username and avatar

    // Append image URL to each blog
    const blogsWithImageUrl = blogs.map((blog) => ({
      ...blog.toJSON(),
      imageUrl: `${process.env.BACKEND_URL}/storage/${blog.image}`,
      category: blog.category?.categoryName
    }));
    // Sort blogs by createdAt in descending order (newest first)
    blogsWithImageUrl.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.status(200).json({
      message: "Blogs fetched successfully",
      count: blogs.length,
      data: blogsWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch blog
exports.fetchBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    if (!blogId) {
      return res.status(400).json({
        message: "Blog ID is required",
        field: "id",
      });
    }

    const blog = await Blog.findById(blogId)
    .populate("category")
    .populate("author", "username avatar"); // populate author username and avatar
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
        field: "id",
      });
    }

    // Append image URL to the blog
    const blogWithImageUrl = {
      ...blog.toJSON(),
      imageUrl: `${process.env.BACKEND_URL}/storage/${blog.image}`,
      category: blog.category?.categoryName
    };

    res.status(200).json({
      message: "Blog fetched successfully",
      data: blogWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch my blogs
exports.fetchMyBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ 
        message: "User not authenticated",
        field: "userId"
      });
    }

    const blogs = await Blog.find({ author: userId })
    .populate("category")
    .populate("author", "username avatar"); 

    // Append image URL to each blog
    const blogsWithImageUrl = blogs.map((blog) => ({
      ...blog.toJSON(),
      imageUrl: `${process.env.BACKEND_URL}/storage/${blog.image}`,
      category: blog.category?.categoryName
    }));
    blogsWithImageUrl.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.status(200).json({
      message: "My blogs fetched successfully",
      count: blogs.length,
      data: blogsWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    if (!blogId) {
      return res.status(400).json({
        message: "Blog ID is required",
        field: "id",
      });
    }

    const existingBlog = await Blog.findById(blogId).populate("category").populate("author", "username avatar");
    if (!existingBlog) {
      return res.status(404).json({
        message: "Blog not found",
        field: "id",
      });
    }

    const { title, description, category } = req.body;

    if (title && (title.length < 5 || title.length > 100)) {
      return res.status(400).json({
        message: "Blog title must be between 5 and 100 characters",
        field: "title",
      });
    }

    if (description && (description.length < 5 || description.length > 8000)) {
      return res.status(400).json({
        message: "Blog description must be between 5 and 8000 characters",
        field: "description",
      });
    }

    // *For Multer:
    // Handle image uploads with Multer
    let newImage;
    let newImageUrl;
    if (req.file) {
      // New image uploaded
      newImage = req.file?.filename;
      newImageUrl = `${process.env.BACKEND_URL}/storage/${req.file?.filename}`;

      // Delete old image from disk
      deleteImageFromDisk(existingBlog.image);
    }
    // If no new image is uploaded, keep the existing image     else {
    else {
      newImage = existingBlog.image; // fallback to existing image if no new image is uploaded
      newImageUrl = `${process.env.BACKEND_URL}/storage/${existingBlog.image}`;
    }

    // REMOVE EXISTING IMAGE
    if (req.body.imageToRemove) {
      const imageToRemove = req.body.imageToRemove;
      // Delete from disk
        deleteImageFromDisk(imageToRemove);
    }

    let categoryId;
    let categoryName;
    if (category) {
      const categoryDoc = await Category.findOne({ categoryName: category });
      if (!categoryDoc) {
        return res.status(400).json({
          message: "Category not found",
          field: "category",
        });
      }
      categoryId = categoryDoc._id;
      categoryName = categoryDoc.categoryName;
    } else {
      categoryId = existingBlog.category;
      categoryName = existingBlog.category?.categoryName;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        image: newImage,
        description,
        category: categoryId,
      },
      { new: true },
    );

    // Append image URL to the updated blog
    const updatedBlogWithImageUrl = {
      ...updatedBlog.toJSON(),
      imageUrl: newImageUrl,
      category: categoryName
    };

    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlogWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    if (!blogId) {
      return res.status(400).json({
        message: "Blog ID is required",
        field: "id",
      });
    }

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
        field: "id",
      });
    }

    // Delete image from disk after blog is removed from DB
    deleteImageFromDisk(blog.image);

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
