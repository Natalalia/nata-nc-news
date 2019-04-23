const { expect } = require("chai");
const {
  changeKey,
  createObjectRef,
  formatData
} = require("../utils/formating-functions");

describe("changeKey", () => {
  it("returns a NEW empty array when an empty array is passed", () => {
    const array = [];
    expect(changeKey(array)).to.eql([]);
  });
  it("returns a NEW array with a single object changed key when a single object array is passed", () => {
    const array = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const key = "created_by";
    const updatedKey = "author";
    const newArray = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        author: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    expect(changeKey(array, key, updatedKey)).to.eql(newArray);
  });
  it("returns a NEW array of objects with a key changed when an array of several objects is passed", () => {
    const array = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "pispy",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const key = "created_by";
    const updatedKey = "author";
    const newArray = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        author: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        author: "pispy",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    expect(changeKey(array, key, updatedKey)).to.eql(newArray);
  });
});

describe("createObjectRef", () => {
  it("returns an empty object when an empty array is passed", () => {
    const array = [];
    expect(createObjectRef(array)).to.eql({});
  });
  it("returns an object with a single key-value, which key is a value from the object in the array and its value another value from the object of the array", () => {
    const array = [
      {
        article_id: 7,
        title: "Making sense of Redux",
        body: "turururuu",
        votes: 0,
        topic: "cooking",
        author: "tickle122",
        created_data: 1468087638932
      }
    ];
    const key1 = "title";
    const key2 = "article_id";
    const output = { "Making sense of Redux": 7 };
    expect(createObjectRef(array, key1, key2)).to.eql(output);
  });
  it("returns an object with several key-value, which keys are values from the objects in the array and its values another values from the objects of the array", () => {
    const array = [
      {
        article_id: 7,
        title: "Making sense of Redux",
        body: "turururuu",
        votes: 0,
        topic: "cooking",
        author: "tickle122",
        created_data: 1468087638932
      },
      {
        article_id: 10,
        title: "Learning to code",
        body: "turururuu",
        votes: 0,
        topic: "coding",
        author: "pispy",
        created_data: 1468087638932
      }
    ];
    const key1 = "title";
    const key2 = "article_id";
    const output = { "Making sense of Redux": 7, "Learning to code": 10 };
    expect(createObjectRef(array, key1, key2)).to.eql(output);
  });
});

describe("formatData", () => {
  it("returns a NEW empty array when an empty array is passed", () => {
    const array = [];
    expect(formatData(array)).to.eql([]);
  });
  it("returns a single element array, and switches out the belongs_to for the article_id", () => {
    const array = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to: "Making sense of Redux",
        author: "pispy",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const refObject = { "Making sense of Redux": 7 };
    const newArray = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 7,
        author: "pispy",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const newKey = "article_id";
    const reference = "belongs_to";
    expect(formatData(array, refObject, newKey, reference)).to.eql(newArray);
  });
  it("returns a several elements array, where switches out the belongs_to for the article_id", () => {
    const array = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to: "Making sense of Redux",
        author: "pispy",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        author: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const refObject = {
      "Making sense of Redux": 7,
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 3
    };
    const newArray = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 7,
        author: "pispy",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 3,
        author: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const newKey = "article_id";
    const reference = "belongs_to";
    expect(formatData(array, refObject, newKey, reference)).to.eql(newArray);
  });
});
