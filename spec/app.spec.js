process.env.NODE_ENV = "test";

const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const request = supertest(app);

describe.only("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe("/topics", () => {
      it("GET status: 200 - Returns an array of all the topics objects, with its relevant keys", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("description", "slug");
          });
      });
    });
    describe("/articles", () => {
      it("GET status: 200 - Returns an array of article objects", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
          });
      });
      it("GET status: 200 - Returns array of article objects with relevant keys", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("GET status: 200 - Returns array of articles objects with its correspondent value", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.eql({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              topic: "mitch",
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              comment_count: 13
            });
            expect(body.articles[8]).to.eql({
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              topic: "mitch",
              created_at: "1986-11-23T12:21:54.171Z",
              votes: 0,
              comment_count: 2
            });
          });
      });
      it("GET status: 200 - filters the articles by the username in an author query", () => {
        return request
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].author).to.equal("icellusedkars");
          });
      });
      it("GET status: 200 - filters the articles by the topic value specified in the query", () => {
        return request
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.equal("cats");
          });
      });
    });
  });
});
