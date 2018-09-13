const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("GET /users/signup", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}signup`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });

  });

  describe("POST /users", () => {

  // #1
    it("should create a new user with valid values and redirect", (done) => {

      const options = {
        url: base,
        form: {
          username: "bik",
          email: "user@example.com",
          password: "123456789"
        }
      }

      request.post(options,
        (err, res, body) => {

  // #2
          User.findOne({where: {email: "user@example.com"}})
          .then((user) => {
            expect(user).not.toBeNull();
            expect(user.email).toBe("user@example.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

  // #3
    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post(
        {
          url: base,
          form: {
            username: "moo",
            email: "incorrectEmail",
            password: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({where: {email: "incorrectEmail"}})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

  });

  describe("GET /users/sign_in", () => {

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });

  });

  describe("GET /users/:id", () => {

    beforeEach((done) => {

      this.user;

      User.create({
        username: "bik",
        email: "bik@example.com",
        password: "password",
        role: 0
      })
      .then((user) => {
        this.user = user;
        done()
      });

    });

    it("should show logged in users page", (done) => {

      request.get(`${base}${this.user.id}`, (err, res, body) => {
        expect(body).toContain("profile");
        done();
      });
    });

  });

  describe("POST /users/:id/updatestandard", () => {

    beforeEach((done) => {

      this.user;

      User.create({
        username: "bik",
        email: "bik@example.com",
        password: "password",
        role: 1
      })
      .then((res) => {
        this.user = res;
        done()
      });

    });

    it("should change roles value to 0 when a user chooses the standard account", (done) => {

        request.post(`${base}${this.user.id}/updatestandard`, (err,res, body) => {

          expect(err).toBeNull();

          User.findOne({ where: {id: this.user.id}})
          .then((user)=> {
            expect(user.role).toBe(0)
            done();
          });
        });

    });
  });

  describe("POST /users/:id/upgradepremium", () => {

    beforeEach((done) => {

      this.user;

      User.create({
        username: "bik",
        email: "bik@example.com",
        password: "password",
        role: 0
      })
      .then((res) => {
        this.user = res;
        done()
      });

    });

    it("should change roles value to 1 when a user chooses premium account", (done) => {

      request.post(`${base}${this.user.id}/updatepremium`, (err,res, body) => {

        expect(err).toBeNull();

        User.findOne({ where: {id: this.user.id}})
        .then((user)=> {
          expect(user.role).toBe(1)
          done();
        });

      });
    });

  });


});
