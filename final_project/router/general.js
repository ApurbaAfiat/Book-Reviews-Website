const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Register the new user
  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book list using async-await with axios
public_users.get('/books', async function (req, res) {
  try {
    // Simulating an async operation with axios by making a request to our own endpoint
    // In a real scenario, this might be an external API call
    const response = await axios.get('http://127.0.0.1:5000/');
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Alternative: Get book list using Promise callbacks with axios
public_users.get('/books-promise', function (req, res) {
  axios.get('http://127.0.0.1:5000/')
    .then(response => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
      res.status(500).json({message: "Error fetching books", error: error.message});
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
 });

// Get book details based on ISBN using async-await with axios
public_users.get('/isbn-async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://127.0.0.1:5000/isbn/${isbn}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: "Error fetching book by ISBN", 
      error: error.response?.data?.message || error.message
    });
  }
});

// Get book details based on ISBN using Promise callbacks with axios
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://127.0.0.1:5000/isbn/${isbn}`)
    .then(response => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
      res.status(error.response?.status || 500).json({
        message: "Error fetching book by ISBN", 
        error: error.response?.data?.message || error.message
      });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const filteredBooks = {};
  
  bookKeys.forEach(key => {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  });
  
  if (Object.keys(filteredBooks).length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Get book details based on author using async-await with axios
public_users.get('/author-async/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://127.0.0.1:5000/author/${encodeURIComponent(author)}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: "Error fetching books by author", 
      error: error.response?.data?.message || error.message
    });
  }
});

// Get book details based on author using Promise callbacks with axios
public_users.get('/author-promise/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://127.0.0.1:5000/author/${encodeURIComponent(author)}`)
    .then(response => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
      res.status(error.response?.status || 500).json({
        message: "Error fetching books by author", 
        error: error.response?.data?.message || error.message
      });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const filteredBooks = {};
  
  bookKeys.forEach(key => {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  });
  
  if (Object.keys(filteredBooks).length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
