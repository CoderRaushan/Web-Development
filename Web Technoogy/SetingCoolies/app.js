const express = require('express');
const app = express();
const port = 8761;
const jsCookie=require("js-cookie");
// Setting a cookie on the client side
app.get('/setCookie', (req, res) => {
  res.cookie('username', 'Raushan', {
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiry time (1 day)
    httpOnly: true,               // Makes cookie accessible only to the server
    secure: false,                 // Ensures cookie is sent over HTTPS only
    sameSite: 'strict'            // Prevents CSRF attacks
  });
  res.send('Cookie has been set!');
});

app.get('/', (req, res) => {
  res.send('Welcome! Go to /set-cookie to set a cookie.');
  Cookies.get()
});
app.get('/delete', (req, res) => {
  res.send('Welcome! Go to /set-cookie to set a cookie.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
