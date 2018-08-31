function handleValidateUsers(req, res, next, method, validation) {
      if(req.method === "POST") {
        validation();
      }
      const errors = req.validationErrors();

      if (errors) {
        req.flash("error", errors);
        return res.redirect(req.headers.referer);
      } else {
        return next();
      }
}

module.exports = {

  validateUsers(req, res, next){
    return handleValidateUsers(req, res, next, 'POST', () => {
      req.checkBody("username", "must be at least two characters in length").isLength({min: 2});
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
      req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
    });
  }

}
