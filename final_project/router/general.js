const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password required",
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User registered successfully",
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const result = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase(),
  );

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase(),
  );

  return res.status(200).json(result);
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews);
});

// Task 10: Get all books using Axios and async/await
public_users.get("/async", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Error retrieving books" });
  }
});

// Task 11: Get book details by ISBN using Axios and async/await
public_users.get("/async/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${encodeURIComponent(req.params.isbn)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Error retrieving book" });
  }
});

// Task 12: Get book details by author using Axios and async/await
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(req.params.author)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Error retrieving books" });
  }
});

// Task 13: Get book details by title using Axios and async/await
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(req.params.title)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Error retrieving books" });
  }
});

module.exports.general = public_users;
