"use strict";

const express    = require("express"),
 	  app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

// a function that adds a new campground to the Database
function addCampgroundDB(campground) {
	Campground.create(campground, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			console.log("---NEWLY CREATED CAMPGROUND---");
			console.log(campground);
		}
	})
}

// Routes
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	// retrive all campgrounds from DB
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds: campgrounds});
		}
	});
});


app.get("/campgrounds/new", function(req, res) {
    res.render("new"); 
});

app.post("/campgrounds", function(req, res) {
    // get data from form
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    addCampgroundDB(newCampground);
	// redirect back to campgrounds page
	res.redirect("/campgrounds");
});

app.listen(8080, function() {
    console.log("The YelpCamp Server Has Started.");
});