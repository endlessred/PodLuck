var Podcast = require("../models/podcast");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareOBJ = {};


middlewareOBJ.checkPodcastOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
        Podcast.findById(req.params.id, function(err, foundPodcast){
            if(err){
                req.flash("error", "Podcast not found");
                res.redirect("back");
            } else {
                if(foundPodcast.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
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
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareOBJ.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareOBJ;