const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
console.log(__dirname);
//console.log(__filename);
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

console.log(path.join(__dirname, "../public"));
const publicDirectoryPath = path.join(__dirname, "../public");

const app = express();
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
//app.set("views", "viewPath");
app.use(express.static(publicDirectoryPath));

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About US",
    name: "RAshi",
  });
});
app.get("", (req, res) => {
  res.render("index", {
    title: "Wether",
    name: "RashiChaudhari",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    HelpText: "This is some helping site",
    title: "Help Me",
    name: "Rashi",
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return;
    res.send({
      error: "You must provide a address",
    });
  }
  geocode(req.query.address, (error, { lattitude, longitude, location }) => {
    if (error) {
      return res.send({ error });
    }
    forecast(lattitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address,
      });
    });
  });
  /*res.send({
    forecast: "It is snowing",
    location: "Philadelphia",
    address: req.query.address,
  });*/
});
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    product: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Rashi",
    errorMessage: "Help artical not Found",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Rashi",
    errorMessage: "Page not Found",
  });
});
app.listen(3000, () => {
  console.log("server is up on port 3000.");
});
