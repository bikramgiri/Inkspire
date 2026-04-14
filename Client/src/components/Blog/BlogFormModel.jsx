import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  List,
  ListOrdered,
  ArrowLeft,
  ChevronDown,
  X,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Tag,
} from "lucide-react";
import { APIAuthenticated } from "../../http";

// constants 
const HEADINGS = [
  { label: "Paragraph", tag: "p", className: "text-base text-gray-700" },
  {
    label: "Heading 1",
    tag: "h1",
    className: "text-2xl font-bold text-gray-900",
  },
  {
    label: "Heading 2",
    tag: "h2",
    className: "text-xl font-bold text-gray-900",
  },
  {
    label: "Heading 3",
    tag: "h3",
    className: "text-lg font-semibold text-gray-900",
  },
  {
    label: "Heading 4",
    tag: "h4",
    className: "text-base font-semibold text-gray-900",
  },
  {
    label: "Heading 5",
    tag: "h5",
    className: "text-sm font-semibold text-gray-900",
  },
  {
    label: "Heading 6",
    tag: "h6",
    className: "text-xs font-semibold text-gray-600",
  },
];

const ALIGNMENTS = [
  { cmd: "justifyLeft", Icon: AlignLeft, title: "Align left" },
  { cmd: "justifyCenter", Icon: AlignCenter, title: "Align center" },
  { cmd: "justifyRight", Icon: AlignRight, title: "Align right" },
  { cmd: "justifyFull", Icon: AlignJustify, title: "Justify" },
];

// sub-components 
function ToolBtn({ onClick, active, title: tip, children }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={tip}
      className={`cursor-pointer p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />;
}

// main component
export default function BlogFormModel({
  type = "add",
  blog,
  formData,
  onChange,
  onSubmit,
  onDiscard,
  getRootProps,
  getInputProps,
  isDragActive,
  isSubmitting,
  file,
  onRemoveFile,
  onRemoveExisting,
  errors = {},
}) {
  const navigate = useNavigate();
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  // refs
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const editorInitialized = useRef(false);

  // local state
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedRange, setSavedRange] = useState(null);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    justifyLeft: true,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });

  // fetch categories once
  useEffect(() => {
    const load = async () => {
      setCatLoading(true); 
      try {
        const res = await APIAuthenticated.get("/api/category");
        if (res.status === 200) setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setCatLoading(false);
      }
    };
    load();
  }, []);

  // initialise editor content (edit mode)
  useEffect(() => {
    if (
      editorRef.current &&
      !editorInitialized.current &&
      formData?.description
    ) {
      editorRef.current.innerHTML = formData.description;
      editorInitialized.current = true;
    }
  }, [formData?.description]);

  // close category dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(e.target)
      ) {
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // rich-text helpers
  const saveRange = () => {
    const sel = window.getSelection();
    if (sel?.rangeCount > 0) setSavedRange(sel.getRangeAt(0).cloneRange());
  };

  const restoreRange = () => {
    if (!savedRange) return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  };

  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
    });
  };

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    checkFormats();
  };

  const formatBlock = (tag) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    setShowHeadingMenu(false);
  };

  const insertLink = () => {
    restoreRange();
    if (linkUrl.trim()) {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      document.execCommand("createLink", false, url);
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const handleImageInsert = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      editorRef.current?.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<figure style="margin:1.5rem 0;"><img src="${ev.target.result}" style="max-width:100%;border-radius:12px;display:block;" /></figure>`,
      );
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // description sync
  const handleEditorInput = () => {
    const html = editorRef.current?.innerHTML || "";
    onChange("description", html);
    checkFormats();
  };

  // title change (event-based)
  const handleTitleChange = (e) => {
    onChange(e);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // submit: sync editor then call parent
  const handleFormSubmit = (e) => {
    if (editorRef.current) {
      onChange("description", editorRef.current.innerHTML);
    }
    onSubmit(e);
  };

  // cover preview
  const coverPreview = file
    ? URL.createObjectURL(file)
    : type === "edit" && blog?.imageUrl && !existingImageRemoved
      ? blog.imageUrl
      : null;

  // render
  return (
    <>
      <style>{`
        .blog-editor:empty::before {
          content: attr(data-placeholder);
          color: #d1d5db;
          pointer-events: none;
        }
        .blog-editor h1 { font-size:2rem; font-weight:700; margin:1.25rem 0 0.5rem; line-height:1.2; }
        .blog-editor h2 { font-size:1.5rem; font-weight:700; margin:1.1rem 0 0.45rem; line-height:1.3; }
        .blog-editor h3 { font-size:1.25rem; font-weight:600; margin:1rem 0 0.4rem; }
        .blog-editor h4 { font-size:1.1rem; font-weight:600; margin:0.9rem 0 0.35rem; }
        .blog-editor h5 { font-size:1rem; font-weight:600; margin:0.75rem 0 0.3rem; }
        .blog-editor h6 { font-size:0.875rem; font-weight:600; margin:0.75rem 0 0.3rem; color:#6b7280; }
        .blog-editor p  { margin:0.35rem 0; }
        .blog-editor blockquote {
          border-left:4px solid #e5e7eb;
          margin:1.25rem 0; padding:0.6rem 1.25rem;
          color:#6b7280; font-style:italic; font-size:1.1rem;
          background:#f9fafb; border-radius:0 8px 8px 0;
        }
        .blog-editor ul { list-style:disc; padding-left:1.75rem; margin:0.5rem 0; }
        .blog-editor ol { list-style:decimal; padding-left:1.75rem; margin:0.5rem 0; }
        .blog-editor li { margin:0.25rem 0; }
        .blog-editor a  { color:#2563eb; text-decoration:underline; }
        .blog-editor img { max-width:100%; border-radius:12px; }
        .link-popover input:focus { outline:none; }
      `}</style>

      <div className="min-h-screen max-w-8xl bg-white">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-4 sm:px-8 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (type === "edit" ? onDiscard?.() : navigate(-1))}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:block">
              {type === "edit" ? "Discard" : "Back"}
            </span>
          </button>

          <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase hidden sm:block">
            {type === "edit" ? "Edit Blog" : "New Blog"}
          </span>

          <div className="flex items-center gap-2">
            {type === "edit" && (
              <button
                type="button"
                onClick={onDiscard}
                className="px-3 sm:px-4 py-1.5 text-sm text-gray-600 border border-gray-400 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="cursor-pointer px-3 sm:px-4 py-1.5 text-sm text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving…"
                : type === "edit"
                  ? "Update"
                  : "Publish"}
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          {/* General error banner */}
          {errors?.general && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {errors.general}
            </div>
          )}

          {/* Cover image */}
          <div className="mb-6">
            {coverPreview ? (
              <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="w-full h-44 sm:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <button
                  type="button"
                  onClick={() => {
                    if (file) {
                      onRemoveFile();
                    } else if (
                      type === "edit" &&
                      onRemoveExisting &&
                      blog?.image
                    ) {
                      onRemoveExisting(blog.image);
                      setExistingImageRemoved(true);
                    }
                  }}
                  className="cursor-pointer absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`w-full h-28 sm:h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDragActive
                    ? "border-indigo-400 bg-indigo-50 text-indigo-500"
                    : errors?.image
                      ? "border-red-300 bg-red-50 text-red-400"
                      : "border-gray-300 text-gray-400 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-500"
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">
                  {isDragActive ? "Drop image here…" : "Add a cover image"}
                </span>
                <span className="text-xs opacity-70">PNG, JPG up to 10 MB</span>
              </div>
            )}
            {errors?.image && (
              <p className="mt-1.5 text-xs text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Category selector */}
          <div className="mb-5" ref={categoryMenuRef}>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              Category
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryMenu((p) => !p)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors w-full sm:w-72 ${
                  errors?.category
                    ? "border-red-300 bg-red-50 text-red-500"
                    : formData?.category
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Tag className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left truncate">
                  {formData?.category || "Select a category"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    showCategoryMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCategoryMenu && (
                <div className="absolute left-0 top-12 z-50 w-full sm:w-72 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 max-h-60 overflow-y-auto">
                  {catLoading ? (
                    <p className="px-4 py-3 text-sm text-gray-400">
                      Loading categories…
                    </p>
                  ) : categories.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">
                      No categories found
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          onChange("category", cat.categoryName);
                          setShowCategoryMenu(false);
                        }}
                        className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-200 transition-colors ${
                          formData?.category === cat.categoryName
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-gray-700"
                        }`}
                      >
                        {cat.categoryImageUrl && (
                          <img
                            src={cat.categoryImageUrl}
                            alt={cat.categoryName}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                        )}
                        <span className="flex-1">{cat.categoryName}</span>
                        {formData?.category === cat.categoryName && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {errors?.category && (
              <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Title */}
          <textarea
            name="title"
            placeholder="Title"
            value={formData?.title || ""}
            onChange={handleTitleChange}
            className={`w-full text-3xl sm:text-4xl font-bold text-gray-900 border-none outline-none resize-none leading-tight mb-1 bg-transparent ${
              errors?.title ? "placeholder-red-300" : "placeholder-gray-300"
            }`}
            rows={1}
            style={{ overflow: "hidden" }}
          />
          {errors?.title && (
            <p className="mb-2 text-xs text-red-500">{errors.title}</p>
          )}

          <hr className="border-gray-100 mb-5" />

          {/* Formatting toolbar */}
          <div className="sticky top-14 z-20 bg-white border border-gray-200 rounded-xl px-2 py-1.5 flex items-center gap-0.5 flex-wrap mb-6 shadow-sm">
            {/* Style dropdown */}
            <div className="relative">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowHeadingMenu((p) => !p);
                  setShowLinkInput(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Style <ChevronDown className="w-3 h-3" />
              </button>
              {showHeadingMenu && (
                <div className="absolute left-0 top-9 z-50 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 overflow-hidden">
                  {HEADINGS.map((h) => (
                    <button
                      key={h.tag}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatBlock(h.tag);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${h.className}`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Divider />

            <ToolBtn
              onClick={() => exec("bold")}
              active={activeFormats.bold}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn
              onClick={() => exec("italic")}
              active={activeFormats.italic}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            {ALIGNMENTS.map(({ cmd, Icon, title: tip }) => (
              <ToolBtn
                key={cmd}
                onClick={() => exec(cmd)}
                active={activeFormats[cmd]}
                title={tip}
              >
                <Icon className="w-4 h-4" />
              </ToolBtn>
            ))}

            <Divider />

            <ToolBtn
              onClick={() => formatBlock("blockquote")}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn
              onClick={() => exec("insertUnorderedList")}
              title="Bullet list"
            >
              <List className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn
              onClick={() => exec("insertOrderedList")}
              title="Numbered list"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            {/* Link */}
            <div className="relative">
              <ToolBtn
                onClick={() => {
                  saveRange();
                  setShowLinkInput((p) => !p);
                  setShowHeadingMenu(false);
                }}
                title="Insert link"
              >
                <LinkIcon className="w-4 h-4" />
              </ToolBtn>
              {showLinkInput && (
                <div className="link-popover absolute left-0 top-10 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 flex items-center gap-2 w-64 sm:w-72">
                  <div
                    className="absolute -top-[9px] left-4"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "9px solid transparent",
                      borderRight: "9px solid transparent",
                      borderBottom: "9px solid #e5e7eb",
                    }}
                  />
                  <div
                    className="absolute -top-[7px] left-[18px]"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "7px solid transparent",
                      borderRight: "7px solid transparent",
                      borderBottom: "7px solid white",
                    }}
                  />
                  <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="url"
                    placeholder="Paste or type URL…"
                    value={linkUrl}
                    autoFocus
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && insertLink()}
                    className="flex-1 text-sm text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent"
                  />
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertLink();
                    }}
                    className="text-green-600 hover:text-green-700 shrink-0"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowLinkInput(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Inline image insert */}
            <ToolBtn
              onClick={() => imageInputRef.current?.click()}
              title="Insert image"
            >
              <ImageIcon className="w-4 h-4" />
            </ToolBtn>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageInsert}
            />
          </div>

          {/* Description error */}
          {errors?.description && (
            <p className="mb-2 text-xs text-red-500">{errors.description}</p>
          )}

          {/* Editor body */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Write your story…"
            onInput={handleEditorInput}
            onMouseUp={checkFormats}
            onKeyUp={checkFormats}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowHeadingMenu(false);
                setShowLinkInput(false);
              }
            }}
            className="blog-editor min-h-96 text-gray-800 text-lg leading-relaxed outline-none pb-24"
          />
        </div>
      </div>
    </>
  );
}
