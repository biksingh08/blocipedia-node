const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("WikiTest", () => {

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

    describe("#create()", () => {

        it("should create a wiki object with a title, body and privacy setting", (done) => {

            Wiki.create({
                title: "wiki test 1",
                body: "so far going great",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {

                expect(wiki.title).toBe("wiki test 1");
                expect(wiki.body).toBe("so far going great");
                expect(wiki.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a wiki object with a missing title, body or privacy setting", (done) => {

            Wiki.create({
                title: "Missing privacy setting in this wiki",
                userId: this.user.id
            })
            .then((wiki) => {

                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Wiki.body cannot be null");
                done();
            })
        });

    });

    describe("#setUser()", () => {

        it("should associate wiki and user together", (done) => {

            User.create({
                username: "moo",
                email: "test@example.com",
                password: "password"
            })
            .then((newUser) => {

                expect(this.wiki.userId).toBe(this.user.id);

                this.wiki.setUser(newUser)
                .then((wiki) => {

                    expect(this.wiki.userId).toBe(newUser.id);
                    done();
                });
            })
        });
    });

    describe("#getUser()", () => {

        it("should return the associated user", (done) => {

            this.wiki.getUser()
            .then((associatedUser) => {
                expect(associatedUser.email).toBe("bik@example.com");
                done();
            });
        });
    });
});
