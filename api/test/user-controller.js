const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const UserController = require("../controllers/user");

describe("User controller", function() {
  before(function(done) {
    const MONGODB_URI =
      "mongodb+srv://czr:IdRJowB9N0pVEAO8@cluster0.lolcv.mongodb.net/test-messages";
    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        const user = new User({
          email: "test@test.com",
          password: "password",
          name: "test",
          posts: [],
          _id: "5f85b388e4a82367e5ef3c1d"
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });

  it("should respond with valid user status", function(done) {
    const req = { params: { userId: "5f85b388e4a82367e5ef3c1d" } };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };

    UserController.getStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new");
      done();
    });
  });
});
