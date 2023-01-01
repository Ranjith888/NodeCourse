const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World. This is Home page");
});

app.get("/about", (req, res) => {
  res.send("This is about page");
});

app.get("/contact*us", (req, res) => {
  res.send("This is contact page");
});

app.get("/services", (req, res) => {
  res.send(
    "<ul> <li>Web development</li> <li>Logo design </li> <li>Video Creation</li></ul>"
  );
});

app.post("/login", (req, res) => {
  res.send("login success");
});

app.delete("/delete", (req, res) => {
  res.send("Delete success");
});

app.get("/user/:id/status/:status_id", (req, res) => {
  res.send(req.params);
});

app.get("/user", (req, res) => {
  res.status(200).json({ user: "Ranjith", no: 8 });
});

app.listen(3000, () => console.log("Server is listening at 3000"));
