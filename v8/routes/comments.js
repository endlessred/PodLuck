var express = require("express");
var router  = express.Router({mergeParams: true});
var Podcast = require("../models/podcast");
var Comment = require("../models/comment");

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    Podcast.findById(req.params.id, function(err, podcast){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {podcast: podcast});
        }
    });
});

//Comments Create
router.post("/", isLoggedIn, function(req, res){
    Podcast.findById(req.params.id, function(err, podcast){
        if(err){
            console.log(err);
            res.redirect("/podcasts");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    podcast.comments.push(comment);
                    podcast.save();
                    console.log(comment);
                    res.redirect('/podcasts/' + podcast._id);
                }
            });
        }
    });
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;