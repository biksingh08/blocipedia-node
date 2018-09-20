const wikiQueries = require("../db/queries.wikis.js");
const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/wiki");
const markdown = require( "markdown" ).markdown;
const Collaborator = require("../db/models").Collaborators;

module.exports = {

    index(req,res,next){

      wikiQueries.getAllWikis(req.user.id, (err,wikis)=>{
          if(err) {
              console.log(err);
          } else {
              res.render("wikis/index", {wikis})
          }
      });

  },

    new(req, res, next) {

      const authorized = new Authorizer(req.user).new();

      if(authorized) {
        res.render("wikis/new", {currentUser: req.user});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/wikis");
        }
    },

    create(req, res, next) {

      const authorized = new Authorizer(req.user).new();

      if(authorized) {

        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        };

        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if(err){
                res.redirect(500, "/wikis/new");
            } else {
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });

      } else {

        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis");
      }

    },

    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {

            if(err || wiki == null) {
                res.redirect(404, "/")
            } else {
                res.render("wikis/edit", {wiki});
            }
        });
    },

    update(req, res, next) {
        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            if(err || wiki == null) {
                res.redirect(404, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    },

    destroy(req, res, next) {

      wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err) {
                res.redirect(err, `/wikis/${req.params.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    },

    show(req, res, next) {

      wikiQueries.getWiki(req.params.id, (err, wiki) => {
        wiki.getCollaborators()
          .then(collaborators => {

            let wikiMarkdown = {
                title: markdown.toHTML(wiki.title),
                body: markdown.toHTML(wiki.body),
                id: wiki.id,
                userId: wiki.userId,
                private: wiki.private,
                collaborators: wiki.collaborators,
                currentUserId: req.user.id
            }
            console.log(wiki.userId, req.user.id);

            if(err || wiki == null) {
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {wikiMarkdown, collaborators});
            }
          });


      });
    }
}
