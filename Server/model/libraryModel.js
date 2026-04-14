const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Library must belong to a user"],
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Library must belong to a blog"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate library entries (critical!)
librarySchema.index({ userId: 1, blogId: 1 }, { unique: true });

const Library = mongoose.model("Library", librarySchema);
module.exports = Library;