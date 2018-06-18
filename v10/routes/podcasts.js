var express = require("express");
var router  = express.Router();
var Podcast = require("../models/podcast");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPodcast = {name: name, image: image, description: desc, author:author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){
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

//EDIT PODCAST ROUTE
router.get("/:id/edit", middleware.checkPodcastOwnership, function(req, res) {
    Podcast.findById(req.params.id, function(err, foundPodcast){
        res.render("podcasts/edit", {podcast: foundPodcast});
    });
});

//UPDATE PODCAST ROUTE
router.put("/:id", middleware.checkPodcastOwnership, function(req, res){
    // find and update the correct campground
    Podcast.findByIdAndUpdate(req.params.id, req.body.podcast, function(err, updatedPodcast){
        if(err){
            res.redirect("/podcasts");
        } else {
            res.redirect("/podcasts/" + req.params.id);
        }
    });
});

//DESTROY PODCAST ROUTE
router.delete("/:id", middleware.checkPodcastOwnership, function(req, res){
   Podcast.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/podcasts");
       } else {
           res.redirect("/podcasts");
       }
   });
});


module.exports = router;