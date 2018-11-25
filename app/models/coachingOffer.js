// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var coachingOffer = mongoose.Schema({
    course : {
      coachId : String,
      courseDescription : String,
      location : String,
      duration : String,
      price : String,
      maxParticipants : Number,
    },
    Bookings : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('coachingOffer', coachingOffer);
