import { create, get, post } from "../src/index";
import { FetchMock } from "jest-fetch-mock";

const fetchMock = fetch as FetchMock;

describe("index", () => {
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("success post with json response", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await post("http://localhost:5000", {
      body: {
        test: "test",
      },
    });

    expect(response.data).toEqual({
      test: "test",
    });
  });

  it("success post with body null and json response", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await post("http://localhost:5000", {
      body: null,
    });

    expect(response.data).toEqual({
      test: "test",
    });
  });

  it("success post with default responseType", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await post("http://localhost:5000", {
      body: {
        test: "test",
      },
    });

    expect(response.data).toEqual({
      test: "test",
    });
  });

  it("success get with blob response", async () => {
    fetchMock.mockResponseOnce(new Blob(["test"]).toString());
    const response = await get("http://localhost:5000", {
      responseType: "blob",
    });

    expect(String(response.data)).toEqual(String(new Blob(["test"])));
  });

  it("success get with arraybuffer response", async () => {
    fetchMock.mockResponseOnce(new ArrayBuffer(4).toString());
    const response = await get("http://localhost:5000", {
      responseType: "arraybuffer",
    });

    expect(String(response.data)).toEqual(String(new ArrayBuffer(4)));
  });

  it("success get with text response", async () => {
    fetchMock.mockResponseOnce("test");
    const response = await get("http://localhost:5000", {
      responseType: "text",
    });

    expect(response.data).toEqual("test");
  });

  it("success get with json response", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await get("http://localhost:5000", {
      responseType: "json",
    });

    expect(response.data).toEqual({
      test: "test",
    });
  });

  it("success get with default responseType", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await get("http://localhost:5000");

    expect(response.data).toEqual({
      test: "test",
    });
  });

  it("unsuccess get with default responseType", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      }),
      {
        status: 400,
      }
    );
    try {
      await get("http://localhost:5000");
    } catch (error: any) {
      expect(error.message).toEqual("Bad Request");
    }
  });

  it("success get using create instance", async () => {
    fetchMock.mockResponses(
      JSON.stringify({ method: "get" }),
      JSON.stringify({ method: "post" }),
      JSON.stringify({ method: "put" }),
      JSON.stringify({ method: "patch" }),
      JSON.stringify({ method: "del" })
    );

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
    });

    const instanceGet = await instance.get("todos/1");
    const instancePost = await instance.post("todos/1", {});
    const instancePut = await instance.put("todos/1", {});
    const instancePatch = await instance.patch("todos/1", {});
    const instanceDel = await instance.del("todos/1");

    expect(instanceGet.data).toEqual({ method: "get" });
    expect(instancePost.data).toEqual({ method: "post" });
    expect(instancePut.data).toEqual({ method: "put" });
    expect(instancePatch.data).toEqual({ method: "patch" });
    expect(instanceDel.data).toEqual({ method: "del" });
  });
});
