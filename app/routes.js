// app/routes.js
var mongoose = require('mongoose');
var user = require('./models/user')
var coachingOffer = require('./models/coachingOffer')

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // DETAILED PROFILE ====================

    app.post('/setupProfile', isLoggedIn, function(req, res) {
      user.findOneAndUpdate({_id : req.body.userId}, req.body, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        return res.redirect('/profile');
      });

    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



  // =====================================
  // FIND COACHES ========================
  // =====================================

  app.get('/findcoach', function(req, res) {
    res.render('findcoach.ejs', {coacheslist : [
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},
      {name : "coach1", location : "basel", sport: "BJJ", description: "a description of the coach, written by him self personally, to give a image of his work", price : "CHF22 90min"},

    ]})
  })

  // =====================================
  // OFFER LESSON ========================
  // =====================================
  app.get('/offerlesson', isLoggedIn, function(req, res){
    let f = function() {
      return(
        coachingOffer.find({course : { coachId : req.user._id }})
      )
    }
  console.log(coachingOffer.find({course : { coachId : req.user._id }}));
    res.render('offerlesson.ejs', {userId : req.user._id, coachingOffers: []})
  })

  app.post('/offerlesson', isLoggedIn, function(req, res){
    coachingOffer.findOneAndUpdate({_id: req.body.id}, {course : req.body}, {upsert: true}, function(err, doc){
      if (err) return res.send(500, { error: err });
      return res.redirect('/offerlesson');
    })
  })

}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
