var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Podcast     = require("./models/podcast"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost/PodLuck");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/podcasts", function(req, res){
        //get all podcasts from db
        Podcast.find({}, function(err, allPodcasts){
            if(err){
                console.log(err);
            } else {
                res.render("podcasts/index",{podcasts:allPodcasts});
            }
        });
});

app.post("/podcasts", function(req, res){
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

app.get("/podcasts/new", function(req, res){
    res.render("podcasts/new");
});



app.get("/podcasts/:id", function(req, res){
    Podcast.findById(req.params.id).populate("comments").exec(function(err, foundPodcast){
        if(err){
            console.log(err);
        } else {
            console.log(foundPodcast);
            res.render("podcasts/show", {podcast: foundPodcast});
        }
    });
});

//******************************************
// Comments Routes
//******************************************

app.get("/podcasts/:id/comments/new", function(req, res){
    Podcast.findById(req.params.id, function(err, podcast){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {podcast: podcast});
        }
    });
});

app.post("/podcasts/:id/comments", function(req, res){
    //lookup podcast using ID
    Podcast.findById(req.params.id, function(err, podcast){
        if(err){
            console.log(err);
            res.redirect("/podcasts");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    podcast.comments.push(comment);
                    podcast.save();
                    res.redirect('/podcasts/' + podcast._id);
                }
            });
        }
    });
    

    //create new comment
    //connect new comment to podcast
    //redirect campground show page
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("PodLuck Server Has Started!");
});