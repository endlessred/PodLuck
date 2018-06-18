var express = require("express");
var router  = express.Router();
var Podcast = require("../models/podcast");

//Index Route
router.get("/", function(req, res){
        //get all podcasts from db
        Podcast.find({}, function(err, allPodcasts){
            if(err){
                console.log(err);
            } else {
                res.render("podcasts/index",{podcasts:allPodcasts});
            }
        });
});

//Create Route
router.post("/", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newPodcast = {name: name, image: image, description: desc};
    //create a new podcast and save to db
    Podcast.create(newPodcast, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/podcasts");
        }
    });
});

//New Route
router.get("/new", function(req, res){
    res.render("podcasts/new");
});

//Show Route
router.get("/:id", function(req, res){
    Podcast.findById(req.params.id).populate("comments").exec(function(err, foundPodcast){
        if(err){
            console.log(err);
        } else {
            console.log(foundPodcast);
            res.render("podcasts/show", {podcast: foundPodcast});
        }
    });
});

module.exports = router;