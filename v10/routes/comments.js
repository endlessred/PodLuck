var express = require("express");
var router  = express.Router({mergeParams: true});
var Podcast = require("../models/podcast");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Podcast.findById(req.params.id, function(err, podcast){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {podcast: podcast});
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
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

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {podcast_id: req.params.id, comment: foundComment});
        }
    });
});

// Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/podcasts/" + req.params.id);
        }
    });
});

// Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/podcasts/" + req.params.id);
       }
    });
});


module.exports = router;