const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborators;

describe("routes : collaborators", () => {

    beforeEach((done) => {

        this.wiki;
        this.user;

        sequelize.sync({force:true}).then((res) => {

            User.create({
                username: "bik",
                email: "bik@example.com",
                password: "password"
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: "Blocipedia collab check",
                    body: "testing 1 2 3",
                    userId: this.user.id,
                    private: false
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("GET /wikis/:wikiId/collaborators", () => {

        it("should render a view with a list of collaborators", (done)=> {
            request.get(`${base}${this.wiki.id}/collaborators`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Add Collaborators");
                done();
            });
        });
    });

    describe("POST /wikis/:wikiId/collaborators/add", () => {

        it("should create a new collaborator and redirect", (done)=> {

            const options = {
                url: `${base}${this.wiki.id}/collaborators/add`,
                form: {
                    wikiId: this.wiki.id,
                    userId: this.user.id
                }
            }

            request.post(options, (err, res, body) => {
                Collaborator.findOne({where:{userId: this.user.id}})
                .then((collaborator) => {
                    expect(collaborator).not.toBeNull();
                    expect(collaborator.wikiId).toBe(this.wiki.id);
                    done();
                })
                .catch((err)=> {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("POST /wikis/:id/collaborators/destroy", () => {

         it("should remove collaborator with associated ID", (done) => {

             Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaborator) => {
                this.collaborator = collaborator;
                 expect(this.collaborator.id).toBe(1);
                 request.post(`${base}${this.wiki.id}/collaborators/${this.collaborator.id}/destroy`, (err, res, body) => {
                     Collaborator.findOne({where:{id:1}})
                     .then((collaborator) => {
                         expect(err).toBeNull();
                         expect(collaborator).toBeNull();
                         done();
                     });
                 });

             })
            .catch((err)=> {
                console.log(err);
                done();
            });

        });
    });


});
