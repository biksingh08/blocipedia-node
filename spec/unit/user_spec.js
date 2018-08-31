const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("User", () => {

    beforeEach((done) => {

        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        })
    });

    describe("#create()", () => {

        it("should create a User object with a valid email and password", (done) => {

            User.create({
                username: "bik",
                email: "user@example.com",
                password: "password"
            })
            .then((user) => {
                expect(user.username).toBe("bik");
                expect(user.email).toBe("user@example.com");
                expect(user.id).toBe(1);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a User object with an invalid email or password", (done) => {

            User.create({
                username: "bik",
                email: "incorrect_email",
                password: "password"
            })
            .then((user) => {

                done();
            })
            .catch((err) => {

                expect(err.message).toContain("Validation error: must be a valid email")
                done();
            });
        });

        it("should not create a user with an email that is already taken", (done) => {

            User.create({
                username: "bik",
                email: "user@example.com",
                password: "password"
            })
            .then((user) => {

                User.create({
                    username: "moo",
                    email: "user@example.com",
                    password: "passwords"
                })
                .then((user) => {

                    done();
                })
                .catch((err) => {

                    expect(err.message).toContain("Validation error");
                    done();
                });

                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a user with a username that is already taken", (done) => {

            User.create({
                username: "bik",
                email: "user@example.com",
                password: "password"
            })
            .then((user) => {

                User.create({
                    username: "bik",
                    email: "user@example.com",
                    password: "passwords"
                })
                .then((user) => {

                    done();
                })
                .catch((err) => {

                    expect(err.message).toContain("Validation error");
                    done();
                });

                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

})
