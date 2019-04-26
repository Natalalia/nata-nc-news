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
      it("PATCH status: 405 - Returns relevant message", () => {
        return request(app)
          .patch("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
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
      it("GET status: 200 - search for an author query that does not have articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(0);
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
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it(" GET search for an author that is not in the database - status 404 and error message", () => {
        return request(app)
          .get("/api/articles?author=natalia")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author Not Found");
          });
      });
      it(" GET search for a topic that is not in the database - status 404 and error message", () => {
        return request(app)
          .get("/api/articles?topic=geography")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Topic Not Found");
          });
      });
      it("PATCH status: 405 - Returns relevant message", () => {
        return request(app)
          .patch("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
    });

    describe("/articles/:article_id", () => {
      it("GET status: 200 - Returns an article object with relevant keys", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("GET bad article_id - status: 400 and error message", () => {
        return request(app)
          .get("/api/articles/dog")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET un-existing article_id - status: 404 and error message", () => {
        return request(app)
          .get("/api/articles/99999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
          });
      });
      it("PATCH status:200 - accepts an object votes which increments votes property", () => {
        const updateVote = { inc_votes: 2 };
        return request(app)
          .patch("/api/articles/1")
          .send(updateVote)
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.eql(102);
          });
      });
      it("PATCH status:200 - accepts an object votes which decrement votes property", () => {
        const updateVote = { inc_votes: -100 };
        return request(app)
          .patch("/api/articles/1")
          .send(updateVote)
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.eql(0);
          });
      });
      it("PATCH no inc_votes on request body - status: 400 and error message", () => {
        const updateVote = {};
        return request(app)
          .patch("/api/articles/1")
          .send(updateVote)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("PATCH invalid inc_votes - status: 400 and error message", () => {
        const updateVote = { inc_votes: "cat" };
        return request(app)
          .patch("/api/articles/1")
          .send(updateVote)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("PUT status: 405 - Returns relevant message", () => {
        return request(app)
          .put("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
    });
    describe("/articles/article_id/comments", () => {
      it("GET status: 200 - Returns array of comments objects with relevant keys", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.contain.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            );
          });
      });
      it("GET status: 200 - sorts the comments by any valid column, defaults to date", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("author", {
              descending: true
            });
          });
      });
      it("GET status: 200 - orders the comments for ascending or descending, defaults to descending", () => {
        return request(app)
          .get("/api/articles/1/comments?order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.eql({
              author: "butter_bridge",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
              created_at: "2016-11-22T12:36:03.389Z",
              votes: 14,
              comment_id: 2
            });
          });
      });
      it("GET article with no comments - status: 200 and a message", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).to.equal("No comments yet");
          });
      });
      it(" GET sort for a column that does not exist - status 400 and error message", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=notAColumn")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("POST status: 201 - responds with the new comment object", () => {
        const newPost = {
          username: "butter_bridge",
          body: "Love your literature"
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newPost)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.contain.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            );
            expect(body.comment.body).to.equal("Love your literature");
          });
      });
      it("POST an empty comment on request body - status: 400 and error message", () => {
        const newPost = {};
        return request(app)
          .post("/api/articles/1/comments")
          .send(newPost)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("POST a non existing author in the db on request body - status: 404 and error message", () => {
        const newPost = {
          username: "nata",
          body: "Love your literature"
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newPost)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Element Not Found");
          });
      });
    });
    describe("/comments/:comment_id", () => {
      it("PATCH status:200 - accepts an object votes which increments/decrements votes property", () => {
        const updateVote = { inc_votes: 2 };
        return request(app)
          .patch("/api/comments/1")
          .send(updateVote)
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.eql(18);
          });
      });
      it("PATCH status:200 - accepts an object votes which increments/decrements votes property", () => {
        const updateVote = { inc_votes: -16 };
        return request(app)
          .patch("/api/comments/1")
          .send(updateVote)
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.eql(0);
          });
      });
      it("PATCH no inc_votes on request body - status: 400 and error message", () => {
        const updateVote = {};
        return request(app)
          .patch("/api/comments/1")
          .send(updateVote)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("PATCH invalid inc_votes - status: 400 and error message", () => {
        const updateVote = { inc_votes: "cat" };
        return request(app)
          .patch("/api/comments/1")
          .send(updateVote)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("DELETE status: 204 - delete the given comment by its id", () => {
        return request(app)
          .delete("/api/comments/5")
          .expect(204);
      });
      it("DELETE a non existing comment - status: 404 and an error message", () => {
        return request(app)
          .delete("/api/comments/99999999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment Not Found");
          });
      });
      it("DELETE an invalid comment - status: 400 and an error message", () => {
        return request(app)
          .delete("/api/comments/dog")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });
    describe("/users/:username", () => {
      it(" GET status: 200 - Responds with a user object with its correspondent keys", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.contain.keys("username", "avatar_url", "name");
          });
      });
      it("GET bad username - status: 404 and error message", () => {
        return request(app)
          .get("/api/users/dog")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("User not found");
          });
      });
    });
  });
});
