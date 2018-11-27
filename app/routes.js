// app/routes.js
var mongoose = require('mongoose');
var user = require('./models/user')
var coachingOffer = require('./models/coachingOffer')


function getAllLocations() {
  let retList = []
  user.find({}, function(err, docs){
    docs.forEach(function(doc){
      console.log('pushing location');
      console.log(doc.location);
      retList.push(doc.location)
    })
  })
  return retList
}
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('newFrontEnd/index.ejs'); // load the index.ejs file
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
      let offers = []
        coachingOffer.find({}, function(err, docs) {
          offers = docs
          console.log(offers);
          res.render('findcoach.ejs', {coacheslist : offers })
        })
      })

      app.post('/applyForCoaching', function(req, res) {
        let user = req.user
        console.log({coach : user, applycation : req.body})
      })

  // =====================================
  // OFFER LESSON ========================
  // =====================================
  app.get('/offerlesson', isLoggedIn, function(req, res){
    let offers = []
      coachingOffer.find({}, function(err, docs) {
        offers = docs
        console.log(offers);
        res.render('offerlesson.ejs' , {userId : req.user._id, coachingOffers: offers})
      })
  })

  app.get('/getAllLocations', function(req, res){
    console.log('?FDDFSDDf');
    console.log(getAllLocations());
  })



  app.post('/newOfferlesson', isLoggedIn, function(req, res){
    var offer = new coachingOffer({course : req.body });
    // Save the new model instance, passing a callback
    offer.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
    res.redirect('/offerlesson')
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
