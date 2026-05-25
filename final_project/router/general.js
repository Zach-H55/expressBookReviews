const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* =========================
   TASK 1–6: EXPRESS ROUTES
========================= */

// Register user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});

// Get by author
public_users.get('/author/:author', (req, res) => {
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

// Get by title
public_users.get('/title/:title', (req, res) => {
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

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});

/* =========================
   TASK 10: GET ALL BOOKS (AXIOS)
========================= */

async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("TASK 10 OUTPUT:");
    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }
}

/* =========================
   TASK 11: GET BY ISBN (AXIOS)
========================= */

async function getBookByISBNAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("TASK 11 OUTPUT:");
    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }
}

/* =========================
   TASK 12: GET BY AUTHOR (AXIOS)
========================= */

async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log("TASK 12 OUTPUT:");
    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }
}

/* =========================
   TASK 13: GET BY TITLE (AXIOS)
========================= */

async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log("TASK 13 OUTPUT:");
    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }
}

/* =========================
   TEST CALLS (UNCOMMENT TO RUN)
========================= */

// getAllBooksAsync();
// getBookByISBNAsync("1");
// getBooksByAuthorAsync("Chinua Achebe");
// getBooksByTitleAsync("Things Fall Apart");

module.exports.general = public_users;