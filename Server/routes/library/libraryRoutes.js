const express = require("express");
const router = express.Router();
const catchError = require("../../services/catchError");
const { addToLibrary, fetchLibraryBlogs, removeFromLibrary } = require("../../controller/library/libraryController");
const isAuthenticated = require("../../middleware/authMiddleware");

router.route("/library")
.post(isAuthenticated, catchError(addToLibrary))
.get(isAuthenticated, catchError(fetchLibraryBlogs))

router.route("/library/:id")
.delete(isAuthenticated, catchError(removeFromLibrary))

module.exports = router;