import { Entry } from "@prisma/client";
import Prisma from "../src/db";
import { server } from "../src/server";

// Test get
describe("/get/ route test", () => {
  let entries: Entry[];
  beforeAll(async () => {
    await Prisma.entry.deleteMany();
    for (let i = 0; i < 4; i++) {
      const entry = {
        title: `title ${i}`,
        description: `description ${i}`,
        created_at: new Date(2001, 1, i),
        scheduled_for: new Date(2001, 2, i),
      };
      try {
        await Prisma.entry.create({ data: entry });
      } catch (exception) {
        throw new Error(`Test setup failed: ${exception}`);
      }
    }
    try {
      entries = (
        await server.inject({
          method: "GET",
          url: "/get/",
        })
      ).json();
    } catch (exception) {
      throw new Error(`Test setup failed: ${exception}`);
    }
  });

  afterAll(async () => {
    await Prisma.entry.deleteMany();
  });

  it("should return expected number of entries", () => {
    expect(entries.length).toEqual(4);
  });
  it("should return the correct object for each entry", () => {
    for (let i = 0; i < 4; i++) {
      const updatedEntry = {
        ...entries[i],
        id: undefined,
        created_at: new Date(entries[i].created_at),
        scheduled_for: new Date(entries[i].scheduled_for),
      };
      expect(updatedEntry).toEqual({
        title: `title ${i}`,
        description: `description ${i}`,
        created_at: new Date(2001, 1, i),
        scheduled_for: new Date(2001, 2, i),
      });
    }
  });
});

describe("/get/:id route test", () => {
  let id: string;
  beforeEach(async () => {
    await Prisma.entry.deleteMany();
    const newEntry = {
      title: `title id1`,
      description: `description id1`,
      created_at: new Date(2001, 1, 23),
      scheduled_for: new Date(2001, 2, 21),
    };
    id = (await Prisma.entry.create({ data: newEntry })).id;
  });

  afterAll(async () => {
    await Prisma.entry.deleteMany();
  });

  it("should return the correct entry values on valid id sent", async () => {
    const retrievedEntry = (
      await server.inject({
        method: "GET",
        url: `/get/${id}`,
      })
    ).json();
    const updatedEntry = {
      ...retrievedEntry,
      id: undefined,
      created_at: new Date(retrievedEntry.created_at),
      scheduled_for: new Date(retrievedEntry.scheduled_for),
    };
    expect(updatedEntry).toEqual({
      title: `title id1`,
      description: `description id1`,
      created_at: new Date(2001, 1, 23),
      scheduled_for: new Date(2001, 2, 21),
    });
  });

  it("should respond with error msg on invalid id", async () => {
    const getResponse = (
      await server.inject({
        method: "GET",
        url: `/get/invalidID`,
      })
    ).json().msg;
    expect(getResponse).toEqual(`Error finding entry with id invalidID`);
  });
});

// Test create
describe("/create/ route test", () => {
  beforeEach(async () => {
    await Prisma.entry.deleteMany();
  });

  afterAll(async () => {
    await Prisma.entry.deleteMany();
  });

  it("should create one correct object in the database", async () => {
    let dbEntries: Entry[];
    let response;
    const newEntry = {
      title: `title id1`,
      description: `description id1`,
      created_at: new Date(2001, 1, 23),
      scheduled_for: new Date(2001, 2, 21),
    };
    try {
      response = (
        await server.inject({
          method: "POST",
          url: `/create/`,
          payload: newEntry,
        })
      ).json();

      dbEntries = await Prisma.entry.findMany();
    } catch (exception) {
      throw new Error(`Test setup failed: ${exception}`);
    }

    const formattedResponse = {
      ...response,
      id: undefined,
      created_at: new Date(response.created_at),
      scheduled_for: new Date(response.scheduled_for),
    };
    expect(formattedResponse).toEqual(newEntry);
    expect(dbEntries.length).toEqual(1);

    const dbEntry = {
      ...dbEntries[0],
      id: undefined,
      created_at: new Date(dbEntries[0].created_at),
      scheduled_for: new Date(dbEntries[0].scheduled_for),
    };
    expect(dbEntry).toEqual({
      title: `title id1`,
      description: `description id1`,
      created_at: new Date(2001, 1, 23),
      scheduled_for: new Date(2001, 2, 21),
    });
  });

  it("should return a failure message on invalid object sent and not create an object in the db", async () => {
    let response;
    let dbEntries: Entry[];
    response = (
      await server.inject({
        method: "POST",
        url: `/create/`,
        payload: {},
      })
    ).json();

    dbEntries = await Prisma.entry.findMany();

    expect(response).toEqual({ msg: "Error creating entry" });
    expect(dbEntries.length).toEqual(0);
  });
});

// Test remove
describe("/delete/:id route test", () => {
  let id: string;
  beforeEach(async () => {
    await Prisma.entry.deleteMany();
    const newEntry = {
      title: `title id1`,
      description: `description id1`,
      created_at: new Date(2001, 1, 23),
      scheduled_for: new Date(2001, 2, 21),
    };
    try {
      id = (await Prisma.entry.create({ data: newEntry })).id;
    } catch (exception) {
      throw new Error(`Test setup failed: ${exception}`);
    }
  });

  afterAll(async () => {
    await Prisma.entry.deleteMany();
  });

  it("should respond with success msg on valid id", async () => {
    const deleteResponse = (
      await server.inject({
        method: "DELETE",
        url: `/delete/${id}`,
      })
    ).json().msg;
    expect(deleteResponse).toEqual("Deleted successfully");
  });

  it("should respond with error msg on invalid id", async () => {
    const deleteResponse = (
      await server.inject({
        method: "DELETE",
        url: `/delete/invalidID`,
      })
    ).json().msg;
    expect(deleteResponse).toEqual("Error deleting entry");
  });
});

// Test edit
describe("/update/:id route test", () => {
  let id: string;
  const updateEntry = {
    title: `title newID`,
    description: `description newDesc`,
    created_at: new Date(2001, 1, 12),
    scheduled_for: new Date(2001, 2, 17),
  };
  beforeEach(async () => {
    await Prisma.entry.deleteMany();
    const newEntry = {
      title: `title id1`,
      description: `description id1`,
      created_at: new Date(2001, 1, 23),
      scheduled_for: new Date(2001, 2, 21),
    };
    try {
      id = (await Prisma.entry.create({ data: newEntry })).id;
    } catch (exception) {
      throw new Error(`Test setup failed: ${exception}`);
    }
  });

  afterAll(async () => {
    await Prisma.entry.deleteMany();
  });

  it("should respond with success msg on valid id and update db entry correctly", async () => {
    const updateResponse = (
      await server.inject({
        method: "PUT",
        url: `/update/${id}`,
        payload: updateEntry,
      })
    ).json().msg;
    expect(updateResponse).toEqual("Updated successfully");

    const entries = await Prisma.entry.findMany();
    expect(entries.length).toEqual(1);
    const formattedDBEntry = {
      ...entries[0],
      id: undefined,
      created_at: new Date(entries[0].created_at),
      scheduled_for: new Date(entries[0].scheduled_for),
    };
    expect(formattedDBEntry).toEqual(updateEntry);
  });

  it("should respond with error msg on invalid id", async () => {
    const updateResponse = (
      await server.inject({
        method: "PUT",
        url: `/update/invalidID`,
        payload: updateEntry,
      })
    ).json().msg;
    expect(updateResponse).toEqual("Error updating");
  });
});
