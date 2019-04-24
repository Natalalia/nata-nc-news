process.env.NODE_ENV = "test";

const { expect, use } = require("chai");
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const chaiSorted = require("chai-sorted");
use(chaiSorted);

describe.only("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe("/topics", () => {
      it("GET status: 200 - Returns an array of all the topics objects, with its relevant keys", () => {
        return request(app)
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
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
          });
      });
      it("GET status: 200 - Returns array of article objects with relevant keys", () => {
        return request(app)
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
        return request(app)
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
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].author).to.equal("icellusedkars");
          });
      });
      it("GET status: 200 - filters the articles by the topic value specified in the query", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.equal("cats");
          });
      });
      it("GET status: 200 - sorts the articles by any valid column, defaults to date", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("topic", { descending: true });
          });
      });
      it("GET status: 200 - orders the articles for ascending or descending, defaults to descending", () => {
        return request(app)
          .get("/api/articles?order=desc")
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
          });
      });
      it(" GET sort for a column that does not exist - status 400 and error message", () => {
        return request(app)
          .get("/api/articles?sort_by=notAColumn")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Not request found");
          });
      });
      it(" GET search for an author that is not in the database - status 404 and error message", () => {
        return request(app)
          .get("/api/articles?author=natalia")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route Not Found");
          });
      });
      it(" GET search for a topic that is not in the database - status 404 and error message", () => {
        return request(app)
          .get("/api/articles?topic=geography")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route Not Found");
          });
      });
    });
  });
});
