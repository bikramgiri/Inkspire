import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { addBlog } from "../../store/blog/blogSlice";
import BlogFormModel from "../../components/Blog/BlogFormModel";
import { toast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    general: "",
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
    // Called as handleChange('fieldName', value) from category / description
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

  // validation
  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      category: "",
      image: "",
      general: "",
    };

    if (!formData.title.trim() || formData.title.trim().length < 5) {
      newErrors.title = "Blog title must be at least 5 characters";
    }
    // Strip HTML tags to check actual text length
    const descText = formData.description.replace(/<[^>]*>/g, "").trim();
    if (!descText) {
      newErrors.description = "Description is required";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    if (!file) {
      newErrors.image = "Cover image is required";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Reset errors first so validateForm results are fresh
    setErrors({
      title: "",
      description: "",
      category: "",
      image: "",
      general: "",
    });

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title.trim());
    formDataToSend.append("description", formData.description); // HTML from rich-text editor
    formDataToSend.append("category", formData.category.trim());
    if (file) formDataToSend.append("image", file);

    try {
      await dispatch(addBlog(formDataToSend));
      toast("Blog published successfully!", "success");
      navigate("/"); 
      // Reset form
      setFormData({ title: "", description: "", category: "" });
      setFile(null);
    } catch (error) {
      const errData = error?.response?.data || error?.data;
      if (
        errData &&
        error?.response?.status >= 400 &&
        error?.response?.status < 500
      ) {
        const field = errData.field;
        const msg = errData.message || "Please check your input.";
        if (
          field &&
          ["title", "description", "category", "image"].includes(field)
        ) {
          setErrors((prev) => ({ ...prev, [field]: msg }));
        } else {
          setErrors((prev) => ({ ...prev, general: msg }));
        }
        toast(msg, "error");
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Something went wrong. Please try again.",
        }));
        toast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogFormModel
      type="add"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      isSubmitting={isSubmitting}
      file={file}
      onRemoveFile={onRemoveFile}
      errors={errors}
    />
  );
};

export default AddBlog;
