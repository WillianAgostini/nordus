import { create } from "../src/index";
import { FetchMock } from "jest-fetch-mock";

describe("index", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("success get using create instance", async () => {
    fetchMock.mockResponse(JSON.stringify({ method: "get" }));

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
    });

    const instanceGet = await instance.get("/todos/1");

    expect(instanceGet.data).toEqual({ method: "get" });
  });

  it("success post using create instance", async () => {
    fetchMock.mockResponse(JSON.stringify({ method: "post" }));

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
    });

    const instancePost = await instance.post("/todos", {
      title: "todo",
      completed: false,
    });

    expect(instancePost.data).toEqual({ method: "post" });
  });

  it("success put using create instance", async () => {
    fetchMock.mockResponse(JSON.stringify({ method: "put" }));

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
    });

    const instancePut = await instance.put("/todos/1", {
      title: "todo",
      completed: false,
    });

    expect(instancePut.data).toEqual({ method: "put" });
  });

  it("success patch using create instance", async () => {
    fetchMock.mockResponse(JSON.stringify({ method: "patch" }));

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
    });

    const instancePatch = await instance.patch("/todos/1", {
      title: "todo",
      completed: false,
    });

    expect(instancePatch.data).toEqual({ method: "patch" });
  });

  it("success del using create instance", async () => {
    fetchMock.mockResponse(JSON.stringify({ method: "delete" }));

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
    });

    const instanceDelete = await instance.del("/todos/1");

    expect(instanceDelete.data).toEqual({ method: "delete" });
  });
});
