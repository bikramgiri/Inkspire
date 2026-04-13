import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { editBlog, fetchSingleBlog } from "../../store/blog/blogSlice";
import BlogFormModel from "../../components/Blog/BlogFormModel";
import { STATUSES } from "../../global/status";
import { Loader2 } from "lucide-react";
import { toast } from "../../utils/toast";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get blog from store 
  const { blogs, singleBlog, status } = useSelector((state) => state.blog);
  const blog =
    blogs.find((b) => b._id === id) ||
    (singleBlog?._id === id ? singleBlog : null);

  // fetch if not in store 
  useEffect(() => {
    if (!blog) dispatch(fetchSingleBlog(id));
  }, [id, dispatch, blog]);

  // form state 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  // populate form once blog is available
  useEffect(() => {
    if (blog) {
      setFormData({
        title:       blog.title       || "",
        description: blog.description || "",
        category:    blog.category    || "",
      });
    }
  }, [blog]);

  const [file, setFile] = useState(null);
  const [imageToRemove, setImageToRemove] = useState(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [errors, setErrors] = useState({
    title: "", description: "", category: "", image: "", general: "",
  });

  // dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setErrors((prev) => ({ ...prev, image: "", general: "" }));
      }
    },
  });

  // field change handler
  const handleChange = (e, directValue) => {
    if (typeof e === "string") {
      setFormData((prev) => ({ ...prev, [e]: directValue }));
      setErrors((prev) => ({ ...prev, [e]: "", general: "" }));
      return;
    }
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const onRemoveFile = () => setFile(null);

  const onRemoveExisting = (filename) => {
    setImageToRemove(filename);
  };

  // validation
  const validateForm = () => {
    const newErrors = {
      title: "", description: "", category: "", image: "", general: "",
    };

    const titleTrim = formData.title.trim();
    if (titleTrim && titleTrim.length < 5) {
      newErrors.title = "Blog title must be at least 5 characters";
    }

    const descText = formData.description.replace(/<[^>]*>/g, "").trim();
    if (formData.description && !descText) {
      newErrors.description = "Description cannot be empty";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({ title: "", description: "", category: "", image: "", general: "" });

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formDataToSend = new FormData();

    // Only send fields that changed
    if (formData.title !== blog?.title)
      formDataToSend.append("title", formData.title.trim());
    if (formData.description !== blog?.description)
      formDataToSend.append("description", formData.description);
    if (formData.category !== blog?.category)
      formDataToSend.append("category", formData.category.trim());
    if (file) formDataToSend.append("image", file);
    if (imageToRemove) formDataToSend.append("imageToRemove", imageToRemove);

    try {
      await dispatch(editBlog({ id: blog._id, data: formDataToSend }));
      toast("Blog updated successfully!", "success");
      navigate(-1);
    } catch (error) {
      const errData = error?.response?.data || error?.data;
      if (errData && error?.response?.status >= 400 && error?.response?.status < 500) {
        const field = errData.field;
        const msg   = errData.message || "Please check your input.";
        if (field && ["title", "description", "category", "image"].includes(field)) {
          setErrors((prev) => ({ ...prev, [field]: msg }));
        } else {
          setErrors((prev) => ({ ...prev, general: msg }));
        }
        toast(msg, "error");
      } else {
        setErrors((prev) => ({ ...prev, general: "Something went wrong. Please try again." }));
        toast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => navigate(-1);

  // loading / not found
  if (status === STATUSES.LOADING || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <BlogFormModel
      type="edit"
      blog={blog}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onDiscard={handleDiscard}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      isSubmitting={isSubmitting}
      file={file}
      onRemoveFile={onRemoveFile}
      onRemoveExisting={onRemoveExisting}
      errors={errors}
    />
  );
};

export default EditBlog;