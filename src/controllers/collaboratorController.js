const Wiki = require("../db/models").Wiki;
const userQueries = require("../db/queries.users.js");
const collaboratorQueries = require("../db/queries.collaborators.js");
const Collaborator = require("../db/models").Collaborators;

module.exports = {

    index(req,res,next){

      const wikiId = req.params.id;

           userQueries.getAllUsers((err, users) => {
             if (err) {
               return console.log(err);
             }

             collaboratorQueries.getCollaborators(wikiId, (err, collaborators) => {
               if (err) {
                 return console.log(err);
               }

               const usersToShow = users.map(user => {
                  user.isCollaborator = !!collaborators.find(collaborator => collaborator.userId === user.id);
                  return user;
               });

               res.render("collaborators/collaborators", {users: usersToShow});
             })
          });
    },

    create(req, res, next) {

        let newCollab = {
            userId: req.body.userId,
            wikiId: req.params.id
        }

        collaboratorQueries.createCollaborator(newCollab, (err, collaborator) => {

            if(err) {
                console.log(err);
                res.redirect(`/`);
            } else {
                res.redirect(`/wikis/${req.params.id}/collaborators`);
                req.flash("notice", "You have successfully added collaborators");
            }
        });
    },

    collaboratorList(req, res, next) {
        collaboratorQueries.getCollaborator(req.params.id, (err, collaborators)=> {
            if(err) {
                console.log(err);
            } else {
                res.render("wikis/show", {collaborators});
            }
        });
    },

    destroy(req, res, next) {

         this.collaborator;

        Collaborator.findOne({where:{wikiId: req.params.id, userId: req.body.userId}})
        .then((collaborator) => {

            this.collaborator = collaborator;
            console.log("collab user id check", collaborator);

             collaboratorQueries.deleteCollaborator(this.collaborator.userId, (err, deletedRecordsCount) => {

                if(err){
                    res.redirect(500, `/wikis/${req.params.id}/collaborators`);
                } else {
                    res.redirect(303, `/wikis/${req.params.id}`);
                }
            });

        });
    }
}
