var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
mongoose.connect("mongodb://localhost/PodLuck");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var podcastSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Podcast = mongoose.model("Podcast", podcastSchema);

// Podcast.create(
//     {
//         name: "Wolverine: The Long Night", 
//         image: "https://pixel.nymag.com/imgs/daily/vulture/2018/03/09/09-wolverine-the-long-night.w710.h473.jpg",
//         description: "Wolverine stars in an all-immersive podcast by Marvel and Stitcher! Special Agents Sally Pierce and Tad Marshall arrive in Burns, Alaska to investigate a string of mysterious deaths…all revolving around a strange newcomer named Logan! Starring Richard Armitage as Wolverine (The Hobbit), Scott Adsit (30 Rock), and featuring special appearances from celebrity talent and podcast favorites!"
        
//     }, 
//     function(err, podcast){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("NEWLY ADDED PODCAST: ");
//             console.log(podcast);
//         }
//     });



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
        //res.render("campgrounds",{campgrounds:campgrounds});
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
    Podcast.findById(req.params.id, function(err, foundPodcast){
        if(err){
            console.log(err);
        } else {
            res.render("show", {podcast: foundPodcast});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("PodLuck Server Has Started!");
});