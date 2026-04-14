const Blog = require("../../model/blogModel");
const Library = require("../../model/libraryModel");
const User = require("../../model/userModel");

// Add To Library
exports.addToLibrary = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ 
      message: "User not authenticated",
      field: "userId"
    });
  }

  const blogId = req.body.blogId || req.params.id;
  if (!blogId) {
    return res.status(400).json({ 
      message: "Blog ID is required",
      field: "blogId"
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ 
      message: "User not found",
      field: "userId"
    });
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ 
      message: "Blog not found",
      field: "blogId"
    });
  }

  const existing = await Library.findOne({ userId, blogId });
  if (existing) {
    return res.status(400).json({
      message: "Blog already in library",
      field: "blogId"
    });
  }

  // pupulate blog details in the response
  await Library.create({ userId, blogId });

  const libraryBlog = await Blog.findById(blogId)
    .populate("category", "categoryName categoryImage _id") // populate category name and image
    .populate("author", "username avatar _id") // populate author username and avatar
    .select("-__v"); // exclude __v field

  res.status(201).json({
    message: "Blog added to library successfully",
    data: libraryBlog,
  });
};

// Fetch Library Blogs
exports.fetchLibraryBlogs = async (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ 
      message: "User not authenticated",
      field: "userId"
    });
  }

  const libraryEntries = await Library.find({ userId })
    // populate blog details in the library entries
    .populate({
      path: "blogId",
      populate: [
        { path: "category", select: "categoryName categoryImage _id" },
        { path: "author", select: "username avatar _id" }
      ]
    });

  // Extract populated blogs
  const blogs = libraryEntries.map((entry) => entry.blogId).filter(Boolean); // safety: remove any null (if blog deleted)

  // Append image URL to each blog
  const blogsWithImageUrl = blogs.map((blog) => ({
    ...blog.toJSON(),
    imageUrl: `${process.env.BACKEND_URL}/storage/${blog.image}`,
  }));
  blogsWithImageUrl.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  res.status(200).json({
    message: "Library blogs fetched successfully",
    totalBlogs: blogs.length,
    data: blogsWithImageUrl,
  });
};

// Remove From Library
exports.removeFromLibrary = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ 
      message: "User not authenticated",
      field: "userId"
    });
  }

  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ 
      message: "Blog ID is required",
      field: "blogId"
    });
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({
      message: "Blog not found",
      field: "blogId"
    });
  }

  await Library.findOneAndDelete({ userId, blogId });

  res.status(200).json({
    message: "Blog removed from library successfully",
  });
};
