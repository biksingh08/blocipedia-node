const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  signUp(req, res, next){
    res.render("users/signup");
  },

  create(req, res, next){
  //#1
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      role: req.body.role
    };
  // #2
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/signup");
      } else {

  // #3
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");

          const sgMail = require('@sendgrid/mail');

          sgMail.setApiKey(process.env.SENDGRID_API_KEY);

          const msg = {
            to: newUser.email,
            from: 'test@blocipedia.com',
            subject: 'Welcome to Blocipedia',
            text: 'where you can collaborate and share',
            html: '<strong>Looking forward to see your stuff!</strong>',
          };
          sgMail.send(msg);
        })
      }
    });
  },

  signInForm(req, res, next){
      res.render("users/sign_in");
  },

  signIn(req, res, next){
   passport.authenticate("local")(req, res, function () {
     if(!req.user){
       req.flash("notice", "Sign in failed. Please try again.")
       res.redirect("/users/sign_in");
     } else {
       console.log(req.user);
       req.flash("notice", "You've successfully signed in!");
       res.redirect("/");
     }
   })
 },

 signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  show(req, res, next){

    userQueries.getUser(req.params.id, (err, user) => {
        if(err || user === null){
            req.flash("notice", "User with provided ID doesn't exist");
            res.redirect("/");

        } else {
            res.render("users/show", {user});
        }
    });

  },

  updateStandard(req, res, next) {

    userQueries.updateUser(req.params.id, 0, (err, user) => {
        if(err || user == null) {
            res.redirect(404, `/users/${req.params.id}`);
        } else {
                req.flash("notice", "Your private wikis are now public");
                res.redirect(`/users/${req.params.id}`);
            }
    });

    wikiQueries.updateWikiPrivacy(req.params.id, false, (err, user) => {
        if(err || user == null) {
            console.log(err);
        } else {
                res.redirect(`/users/${req.params.id}`)
            }
    });

  },

  updatePremium(req, res, next) {

    userQueries.updateUser(req.params.id, 1, (err, user) => {

        if(err || user == null) {
            res.redirect(404, `/users/${req.params.id}`);
        } else {
          req.flash("notice", "You have successfully upgraded to premium account");
            res.redirect(`/users/${req.params.id}`);
        }
    });

  },

  payment(req, res, next) {
    res.render("users/payment");
  }


}
