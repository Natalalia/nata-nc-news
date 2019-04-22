const { expect } = require("chai");
const { changeKey } = require("../utils/formating-functions");

describe.only("changeKey", () => {
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
