var Podcast = require("../models/podcast");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareOBJ = {};


middlewareOBJ.checkPodcastOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
        Podcast.findById(req.params.id, function(err, foundPodcast){
            if(err){
                res.redirect("back");
            } else {
                if(foundPodcast.author.id.equals(req.user._id)) {
                    next();
                } else {
                res.redirect("back");
                }
            }
        });
    } else {
        console.log("You need to be logged in to do that!");
        res.send("You need to be logged in to do that!");
    }

};

middlewareOBJ.checkCommentOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                res.redirect("back");
                }
            }
        });
    } else {
        console.log("You need to be logged in to do that!");
        res.send("You need to be logged in to do that!");
    }
};

middlewareOBJ.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareOBJ;