const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {

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
                    title: "Blocipedia Test",
                    body: "Create wikis like no tomorrow",
                    private: false,
                    userId: this.user.id
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
        })
    })

    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Blocipedia Test");
                expect(body).toContain("Personal Wikis")

                done();
            });
        });
    });

    describe("GET /topics/new", () => {

        it("should render a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/create", () => {
        beforeEach((done) => {
            User.create({
              username: "bik",
              email: "bik@example.com",
              password: "password"
            })
            .then((user)=> {
              request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                  username: user.username,
                  userId: user.id,
                  email: user.email
                }
              },
                (err, res, body) => {
                  done();
            });
          });
        });

        const options = {
            url: `${base}create`,
            form: {
                title: "moo goes the cow",
                body: "lets not annoy the cow",
                private: false,
            }
        };

        it("should create a new wiki and redirect", (done) => {

            request.post(options, (err, res, body) => {

                Wiki.findOne({where: {title: "moo goes the cow"}})
                .then((wiki) => {
                    expect(wiki).not.toBeNull();
                    expect(wiki.title).toBe("moo goes the cow");
                    expect(wiki.body).toBe("lets not annoy the cow");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("GET /wikis/:id", () => {

        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Blocipedia Test")
                done();
            });
        });
    });

    describe("POST /wikis/:id/destroy", () => {

        it("should deleted the wiki with the associated ID", (done) => {

            expect(this.wiki.id).toBe(1);

            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {

                Wiki.findById(1)
                .then((wiki) => {
                    expect(err).toBeNull();
                    expect(wiki).toBeNull();
                    done();
                })
            });
        });
    });

    describe("GET /wikis/:id/edit", () => {

        it("should render a view with an edit wiki form", (done) => {

          request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Wiki");
            expect(body).toContain("Blocipedia Test");
            done();
          });

        });

      });

      describe("POST /wikis/:id/update", () => {

        it("should return a status code of 302", (done) => {

            request.post({
                url: `${base}${this.wiki.id}/update`,
                form: {
                    title: "Update blocipedia",
                    body: "best app in the world"
                }
            }, (err, res, body) => {
                expect(res.statusCode).toBe(302);
                done();
            });
        });

        it('should update the wiki with the given values', (done) => {

            const options = {
                url: `${base}${this.wiki.id}/update`,
                form: {
                    title: "Blocipedia app"
                }
            };

            request.post(options, (err, res, body) => {

                expect(err).toBeNull();

                Wiki.findOne({
                    where: {id: this.wiki.id}
                })
                .then((wiki) => {
                    expect(wiki.title).toBe("Blocipedia app");
                    done();
                })
            });
        });
      });
});
