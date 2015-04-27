function auth (username, password, cb) {
  console.log("AUTHING", username, password);
  if (username === process.env.auth_username && 
      password === process.env.auth_password) {
    cb(null, {auth: username});
  } else {
    cb("Auth error");
  }
}

module.exports = auth