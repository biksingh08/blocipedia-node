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
        });
    });

    // for roles use 0-standard,1-premium,2-admin

    describe("admin user performing CRUD actions for wiki", () => {

        beforeEach((done) => {

            User.create({
              username: "bik",
              email: "bik@example.com",
              password: "password",
              role: 2
            })
            .then((user)=> {
              request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                  username: user.username,
                  userId: user.id,
                  email: user.email,
                  role: user.role
                }
              },
                (err, res, body) => {
                  done();
            });
          });

        });


        describe("GET /wikis/new", () => {

            it("should render a new wiki form", (done) => {

                request.get(`${base}new`, (err, res, body) => {
                    expect(body).toContain("New Wiki");
                    expect(err).toBeNull();
                    done();
                });

            });

        });

         describe("GET /wikis", () => {

             it("should return a status code 200 and all wikis", (done) => {

                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(body).toContain("Blocipedia Test");
                    expect(body).toContain("Personal Wikis");
                    expect(err).toBeNull();
                    done();
                });

            });

        });

        describe("POST /wikis/create", () => {

            const options = {
                url: `${base}create`,
                form: {
                    title: "wiki create test",
                    body: "Too many tests for this wiki",
                    private: false
                }
            }

            it("should create a publik wiki and redirect", (done) => {

                request.post(options, (err, res, body) => {

                    Wiki.findOne({where: {title: "wiki create test"}})
                    .then((wiki) => {
                        expect(wiki.title).toBe("wiki create test");
                        expect(wiki.body).toBe("Too many tests for this wiki");
                        expect(wiki).not.toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });

                });

            });

            it("should create a private wiki and redirect", (done) => {

              const options = {
                  url: `${base}create`,
                  form: {
                      title: "wiki create test",
                      body: "Too many tests for this wiki",
                      private: true
                  }
              }

                request.post(options, (err, res, body) => {

                    Wiki.findOne({where: {title: "wiki create test"}})
                    .then((wiki) => {
                        expect(wiki.title).toBe("wiki create test");
                        expect(wiki.body).toBe("Too many tests for this wiki");
                        expect(wiki).not.toBeNull();
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

            it("should render a view with wiki that is selected", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(body).toContain("Blocipedia Test");
                    expect(err).toBeNull();
                    done();
                });

            });

        });

        describe("POST /wikis/:id/destroy", () => {

            it("should delete the wiki with associated ID", (done) => {
               Wiki.all()
                .then((wiki) => {
                  const wikiCountBeforeDelete = wiki.length;
                  expect(wikiCountBeforeDelete).toBe(1);

                  request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                     Wiki.all()
                     .then((wiki) => {
                        expect(err).toBeNull();
                        expect(wiki.length).toBe(wikiCountBeforeDelete - 1);
                      done();

                     });
                  });

                });
            });

        });

        describe("GET /wikis/:id/edit", () => {

            it("should render a view with an edit wiki form", (done) => {
              request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(body).toContain("Blocipedia Test")
                expect(body).toContain("Edit Wiki");
                expect(err).toBeNull();
                done();
              });

            });

        });

        describe("POST /wikis/:id/update", () => {

            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Blocipedia Test Check",
                        body: "more and more wikis"
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
                        title: "Blocipedia Test Check"
                    }
                }

                request.post(options, (err, res, body) => {

                    expect(err).toBeNull();

                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Blocipedia Test Check");
                        done();
                    });
                });

            });

          });

    });
// end admin user tests

    describe("standard member performing CRUD actions for wiki", () => {

        beforeEach((done) => {
              request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                  role: 0
                }
              },
                (err, res, body) => {
                  done();
            });
        });

        describe("GET /wikis", () => {

            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(body).toContain("Blocipedia Test");
                    expect(body).toContain("Personal Wikis");
                    expect(err).toBeNull();
                    done();
                });
            });

        });

        describe("GET /wikis/new", () => {

            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(body).toContain("New Wiki");
                    expect(err).toBeNull();
                    done();
                });
            });

        });

        describe("POST /wikis/create", () => {

            beforeEach((done) => {

                User.create({
                  username: "bik",
                  email: "bik@example.com",
                  password: "password",
                  role: 0
                })
                .then((user)=> {
                  request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                      username: user.username,
                      userId: user.id,
                      email: user.email,
                      role: user.role
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
                    title: "wiki create test",
                    body: "Too many tests for this wiki",
                    private: false
                }
            }

            it("should create a new wiki and redirect", (done) => {

                request.post(options, (err, res, body) => {

                    Wiki.findOne({where: {title: "wiki create test"}})
                    .then((wiki) => {
                        expect(wiki.title).toBe("wiki create test");
                        expect(wiki.body).toBe("Too many tests for this wiki");
                        expect(wiki).not.toBeNull();
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
                    expect(body).toContain("Blocipedia Test");
                    expect(err).toBeNull();
                    done();
                });
            });

        });

        describe("GET /wikis/:id/edit", () => {

            it("should render a view with an edit wiki form", (done) => {
              request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Blocipedia Test");
                expect(err).toBeNull();
                done();
              });
            });

        });

        describe("POST /wikis/:id/update", () => {

            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Another Blocipedia Test Check",
                        body: "more and more wikis"
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
                        title: "Another Blocipedia Test Check"
                    }
                }

                request.post(options, (err, res, body) => {

                    expect(err).toBeNull();

                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Another Blocipedia Test Check");
                        done();
                    });
                });
            });
          });


          describe("POST /wikis/:id/destroy", () => {

              it("should not delete the wiki with associated ID", (done) => {

                  Wiki.all()
                  .then((wikis) => {
                      const wikiCountBeforeDelete = wikis.length;
                       expect(wikiCountBeforeDelete).toBe(1);
                       request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                          Wiki.all()
                          .then((wikis) => {
                              expect(wikis.length).toBe(wikiCountBeforeDelete);
                              done();
                          })
                      });
                  });
              });

          });
     });
// end standard user tests

    describe("premium member performing CRUD actions for wiki", () => {

        beforeEach((done) => {
            request.get({
              url: "http://localhost:3000/auth/fake",
              form: {
                role: 1
              }
            },
              (err, res, body) => {
                done();
            });
        });

        describe("GET /wikis", () => {

            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(body).toContain("Blocipedia Test");
                    expect(body).toContain("Personal Wikis");
                    expect(err).toBeNull();
                    done();
                });
            });

        });

        describe("GET /wikis/new", () => {

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
                  password: "password",
                  role: 1
                  })
                  .then((user)=> {
                      request.get({
                          url: "http://localhost:3000/auth/fake",
                          form: {
                              username: user.username,
                              userId: user.id,
                              email: user.email,
                              role: user.role
                          }
                      },
                          (err, res, body) => {
                          done();
                      });
                  });
            });

            it("should create a private wiki and redirect", (done) => {
              const options = {
                  url: `${base}create`,
                  form: {
                      title: "wiki create test",
                      body: "Too many tests for this wiki",
                      private: false
                  }
              }
                request.post(options, (err, res, body) => {
                    Wiki.findOne({where: {title: "wiki create test"}})
                    .then((wiki) => {
                        expect(wiki.title).toBe("wiki create test");
                        expect(wiki.body).toBe("Too many tests for this wiki");
                        expect(wiki).not.toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

            it("should create a private wiki and redirect", (done) => {

              const options = {
                  url: `${base}create`,
                  form: {
                      title: "wiki create test",
                      body: "Too many tests for this wiki",
                      private: true
                  }
              }

                request.post(options, (err, res, body) => {
                    Wiki.findOne({where: {title: "wiki create test"}})
                    .then((wiki) => {
                        expect(wiki.title).toBe("wiki create test");
                        expect(wiki.body).toBe("Too many tests for this wiki");
                        expect(wiki).not.toBeNull();
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

            it("should render a view with wiki that is selected", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(body).toContain("Blocipedia Test");
                    expect(err).toBeNull();
                    done();
                });
            });
        });

        describe("GET /wikis/:id/edit", () => {

             it("should render a view with edit wiki form", (done) => {
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
                        title: "Another Blocipedia Test Check",
                        body: "more and more wikis"
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
                        title: "Another Blocipedia Test Check"
                    }
                };
                 request.post(options, (err, res, body) => {
                     expect(err).toBeNull();
                     Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Another Blocipedia Test Check");
                        done();
                    });
                });
            });
        });

        describe("POST /wikis/:id/destroy", () => {

           it("should not delete wiki with associated ID", (done) => {

               Wiki.all()
               .then((wikis) => {
                   const wikiCountBeforeDelete = wikis.length;
                    expect(wikiCountBeforeDelete).toBe(1);
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                       Wiki.all()
                       .then((wikis) => {
                           expect(wikis.length).toBe(wikiCountBeforeDelete);
                           done();
                       })
                   });
               });
           });

       });
    });
// end premium user tests
});
//end all tests
