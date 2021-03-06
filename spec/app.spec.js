process.env.NODE_ENV = "test";

const { expect, use } = require("chai");
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const chaiSorted = require("chai-sorted");
use(chaiSorted);

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
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
      it("POST status: 201 - responds with the topic object", () => {
        const newTopic = {
          description: "Best children books",
          slug: "Reading"
        };
        return request(app)
          .post("/api/topics")
          .send(newTopic)
          .expect(201)
          .then(({ body }) => {
            expect(body.topic).to.contain.keys("description", "slug");
            expect(body.topic.slug).to.equal("Reading");
          });
      });
      it("POST an empty slug on request body - status: 400 and error message", () => {
        const newTopic = {
          description: "Best children books",
          slug: ""
        };
        return request(app)
          .post("/api/topics")
          .send(newTopic)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
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
      it("GET status: 200 - limits the articles shown for page", () => {
        return request(app)
          .get("/api/articles?limit=5")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(5);
          });
      });
      it("GET status: 200 - defaults the limit of articles shown for page to 10", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(10);
          });
      });
      it("GET status: 200 - shows second page with the limited articles", () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(2);
            expect(body.articles[0]["article_id"]).to.equal(11);
          });
      });
      it("GET status: 200 - shows page with no articles", () => {
        return request(app)
          .get("/api/articles?p=200000")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(0);
          });
      });
      it("GET status: 200 - shows object with articles array and total count property", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("articles", "total_count");
          });
      });
      it("GET status: 200 - returns total number of articles when no filter is passed", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body["total_count"]).to.eql(12);
          });
      });
      it("GET status: 200 - returns total number of articles when author query is passed", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body["total_count"]).to.eql(6);
          });
      });
      it("GET status: 200 - returns total number of articles when topic query is passed", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            expect(body["total_count"]).to.eql(1);
          });
      });
      it("POST status: 201 - responds with the new article object", () => {
        const newPost = {
          username: "butter_bridge",
          title: "New Post",
          topic: "mitch",
          body: "Tururu: tururero tururu..."
        };
        return request(app)
          .post("/api/articles")
          .send(newPost)
          .expect(201)
          .then(({ body }) => {
            expect(body.article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count",
              "body"
            );
            expect(body.article.body).to.equal("Tururu: tururero tururu...");
          });
      });
      it("POST an empty article on request body - status: 400 and error message", () => {
        const newPost = {
          username: "butter_bridge",
          title: "New Post",
          topic: "mitch",
          body: ""
        };
        return request(app)
          .post("/api/articles")
          .send(newPost)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("POST an empty article on request title - status: 400 and error message", () => {
        const newPost = {
          username: "butter_bridge",
          title: "",
          topic: "mitch",
          body: "Tururu: tururero tururu..."
        };
        return request(app)
          .post("/api/articles")
          .send(newPost)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("POST a non existing author in the db on request body - status: 404 and error message", () => {
        const newPost = {
          username: "nata",
          title: "New Post",
          topic: "mitch",
          body: "Love your literature"
        };
        return request(app)
          .post("/api/articles")
          .send(newPost)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author Not Found");
          });
      });
      it("GET sort for a column that does not exist - status 400 and error message", () => {
        return request(app)
          .get("/api/articles?sort_by=notAColumn")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET search for an author that is not in the database - status 404 and error message", () => {
        return request(app)
          .get("/api/articles?author=natalia")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author Not Found");
          });
      });
      it("GET search for a topic that is not in the database - status 404 and error message", () => {
        return request(app)
          .get("/api/articles?topic=geography")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Topic Not Found");
          });
      });
      it("GET limit for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles?limit=-5")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET page for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles?p=-6")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET page for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles?limit=dog")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET page for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles?p=dog")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
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
            expect(body.msg).to.equal("Article Not Found");
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
      it("PATCH status: 200 - no inc_votes on request body returns the article object with not modifications", () => {
        const updateVote = { inc_votes: undefined };
        return request(app)
          .patch("/api/articles/1")
          .send(updateVote)
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.eql(100);
          });
      });
      it("DELETE status: 204 - delete the given article by its id", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(204);
      });
      it("DELETE a non existing article - status: 404 and an error message", () => {
        return request(app)
          .delete("/api/articles/99999999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article Not Found");
          });
      });
      it("DELETE an invalid article - status: 400 and an error message", () => {
        return request(app)
          .delete("/api/articles/dog")
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
      it("PATCH inc_votes in a non existing article in db - status: 404 and error message", () => {
        const updateVote = { inc_votes: 5 };
        return request(app)
          .patch("/api/articles/1000000")
          .send(updateVote)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article Not Found");
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
      it("GET status: 200 - limits the number of comments shown", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=5")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.lengthOf(5);
          });
      });
      it("GET status: 200 - defaults the number of comments shown to 10", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.lengthOf(10);
          });
      });
      it("GET status: 200 - shows second page with the limited comments", () => {
        return request(app)
          .get("/api/articles/1/comments?p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.lengthOf(3);
            expect(body.comments[0]["comment_id"]).to.equal(12);
          });
      });
      it("GET status: 200 - shows page with no articles", () => {
        return request(app)
          .get("/api/articles/1/comments?p=200000")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.lengthOf(0);
          });
      });
      it("GET article with no comments - status: 200 and a message", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.lengthOf(0);
          });
      });
      it("GET status: 200 - shows object with comments array and total count property", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("comments", "total_count");
          });
      });
      it("GET status: 200 - returns total number of comments per article", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body["total_count"]).to.eql(13);
          });
      });
      it("GET sort for a column that does not exist - status 400 and error message", () => {
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
      it("GET a non existing id in the db  - status: 404 and error message", () => {
        return request(app)
          .get("/api/articles/158297/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article Not Found");
          });
      });
      it("GET limit for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=-5")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET page for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles/1/comments?p=-6")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET page for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=dog")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET page for non valid number - status 400 and error message", () => {
        return request(app)
          .get("/api/articles/1/comments?p=dog")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("POST an empty comment on request body - status: 400 and error message", () => {
        const newPost = {
          username: "butter_bridge",
          body: ""
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newPost)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("POST a comment with no username on request body - status: 404 and error message", () => {
        const newPost = {
          username: "",
          body: "Turururu"
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newPost)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author Not Found");
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
            expect(body.msg).to.equal("Author Not Found");
          });
      });
      it("PUT status 405 - Returns relevant message", () => {
        return request(app)
          .put("/api/articles/1/comments")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
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
      it("PATCH status:200 - no inc_votes on request body, send unchanged comment", () => {
        const updateVote = { inc_votes: undefined };
        return request(app)
          .patch("/api/comments/1")
          .send(updateVote)
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.eql(16);
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
      it("PATCH comment id does not exist in db - status: 404 and error message", () => {
        const updateVote = { inc_votes: 5 };
        return request(app)
          .patch("/api/comments/100000")
          .send(updateVote)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment Not Found");
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
      it("PUT status 405 - Returns relevant message", () => {
        return request(app)
          .put("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
    });
    describe("/users", () => {
      it("POST status: 201 - responds with the user object", () => {
        const newUser = {
          username: "Pispy",
          avatar_url: "",
          name: "Natalia"
        };
        return request(app)
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .then(({ body }) => {
            expect(body.user).to.contain.keys("username", "avatar_url", "name");
            expect(body.user.username).to.equal("Pispy");
          });
      });
      it("GET status: 200 - Returns an array of all the users objects, with its relevant keys", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.be.an("array");
            expect(body.users[0]).to.contain.keys(
              "username",
              "avatar_url",
              "name"
            );
          });
      });
      it("POST an empty user on request username - status: 400 and error message", () => {
        const newUser = {
          username: "",
          avatar_url: "",
          name: "Natalia"
        };
        return request(app)
          .post("/api/users")
          .send(newUser)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("POST an empty user on request name - status: 400 and error message", () => {
        const newUser = {
          username: "Pispy",
          avatar_url: "",
          name: ""
        };
        return request(app)
          .post("/api/users")
          .send(newUser)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("PUT status 405 - Returns relevant message", () => {
        return request(app)
          .put("/api/users")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
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
      it("PUT status 405 - Returns relevant message", () => {
        return request(app)
          .put("/api/users/butter_bridge")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
    });
  });
});
