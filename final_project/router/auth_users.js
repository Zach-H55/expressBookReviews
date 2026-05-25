const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/* =========================
   HELPER FUNCTIONS
========================= */

// Check if username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check username + password
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

/* =========================
   LOGIN ROUTE
========================= */

regd_users.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  const accessToken = jwt.sign(
    { username },
    "access",
    { expiresIn: 3600 }
  );

  req.session.authorization = {
    accessToken
  };

  return res.status(200).json({
    message: "Login successful",
    token: accessToken
  });
});

/* =========================
   ADD / UPDATE REVIEW (TASK 8)
========================= */

regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization) {
    return res.status(403).json({
      message: "User not logged in"
    });
  }

  let username;
  try {
    username = jwt.verify(
      req.session.authorization.accessToken,
      "access"
    ).username;
  } catch (err) {
    return res.status(403).json({
      message: "Invalid token"
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

/* =========================
   DELETE REVIEW (TASK 9)
========================= */

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  if (!req.session.authorization) {
    return res.status(403).json({
      message: "User not logged in"
    });
  }

  let username;
  try {
    username = jwt.verify(
      req.session.authorization.accessToken,
      "access"
    ).username;
  } catch (err) {
    return res.status(403).json({
      message: "Invalid token"
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found for this user"
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: books[isbn].reviews
  });
});

/* =========================
   EXPORTS
========================= */

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;