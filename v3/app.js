var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Podcast     = require("./models/podcast"),
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
                res.render("index",{podcasts:allPodcasts});
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
    res.render("new.ejs");
});



app.get("/podcasts/:id", function(req, res){
    Podcast.findById(req.params.id).populate("comments").exec(function(err, foundPodcast){
        if(err){
            console.log(err);
        } else {
            console.log(foundPodcast);
            res.render("show", {podcast: foundPodcast});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("PodLuck Server Has Started!");
});