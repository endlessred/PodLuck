var mongoose = require("mongoose");
var Podcast = require("./models/podcast");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Wolverine: The Long Night", 
        image: "https://pixel.nymag.com/imgs/daily/vulture/2018/03/09/09-wolverine-the-long-night.w710.h473.jpg",
        description: "Wolverine stars in an all-immersive podcast by Marvel and Stitcher! Special Agents Sally Pierce and Tad Marshall arrive in Burns, Alaska to investigate a string of mysterious deaths…all revolving around a strange newcomer named Logan! Starring Richard Armitage as Wolverine (The Hobbit), Scott Adsit (30 Rock), and featuring special appearances from celebrity talent and podcast favorites!"
    },
    {
        name: "Harmontown", 
        image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/eb/96/27/eb9627d7-275f-4e05-db82-269c20ec8c55/source/600x600bb.jpg",
        description: "Self destructive writer Dan Harmon claims he will one day found a colony of like-minded misfits. He’s appointed suit-clad gadabout Jeff Davis as his Comptroller and bearded dreamboat Spencer Crittenden as his Dungeon Master. It’s like a neurotic town hall meeting, often with alcohol and famous people."
    },
    {
        name: "Serial", 
        image: "https://is4-ssl.mzstatic.com/image/thumb/Music71/v4/61/59/94/615994ff-21b5-9817-3e89-09b7e012336d/source/600x600bb.jpg",
        description: "A podcast from the creators of This American Life. One story. Told week by week. Hosted by Sarah Koenig."
    }
];
 
function seedDB(){
   //Remove all podcasts
   Podcast.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed podcasts!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few podcasts
            data.forEach(function(seed){
                Podcast.create(seed, function(err, podcast){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a podcast");
                        //create a comment
                        Comment.create(
                            {
                                text: "This Podcast is great! One of my favorites.",
                                author: "Deacon"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    podcast.comments.push(comment);
                                    podcast.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;