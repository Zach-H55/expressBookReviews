const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* =========================
   TASKS 1–6 (UNCHANGED)
========================= */

// Register a new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User registered successfully"
  });
});

// Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});

// Get books by author
public_users.get('/author/:author', function (req, res) {

  let author = req.params.author;
  let result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }

  return res.status(404).json({ message: "No books found for this author" });
});

// Get books by title
public_users.get('/title/:title', function (req, res) {

  let title = req.params.title;
  let result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }

  return res.status(404).json({ message: "No books found for this title" });
});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {

  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});

/* =========================
   TASK 10 - GET ALL BOOKS (AXIOS + ASYNC)
========================= */

async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("TASK 10 OUTPUT:");
    console.log(response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

/* =========================
   TASK 11 - GET BOOK BY ISBN (AXIOS + ASYNC)
========================= */

async function getBookByISBNAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("TASK 11 OUTPUT:");
    console.log(response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

/* =========================
   TEST FUNCTIONS (UNCOMMENT TO RUN)
========================= */

// getAllBooksAsync();
// getBookByISBNAsync("1");

module.exports.general = public_users;