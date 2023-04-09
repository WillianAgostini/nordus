import { create, del, get, patch, post, put } from "../src/index";
import { FetchMock } from "jest-fetch-mock";
import { NordusResponse } from "../src/request";

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

  it("success put with default responseType", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await put("http://localhost:5000", {
      body: {
        test: "test",
      },
    });

    expect(response.data).toEqual({
      test: "test",
    });
  });

  it("success patch with default responseType", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await patch("http://localhost:5000", {
      body: {
        test: "test",
      },
    });

    expect(response.data).toEqual({
      test: "test",
    });
  });

  it("success del with default responseType", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    const response = await del("http://localhost:5000", {
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

  it("success get with formData response", async () => {
    const formData = new FormData();
    formData.append("test", "test");

    fetchMock.mockResponseOnce(formData.toString());
    const response = await get("http://localhost:5000", {
      responseType: "formData",
    });

    expect(String(response.data)).toEqual(String(new FormData()));
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

  it("success get using create instance eith concurrency", async () => {
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

  it("shoud execute successful interceptor", async () => {
    fetchMock.mockResponse(JSON.stringify({ method: "get" }));

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
      interceptors: {
        request: (err, request) => {
          if (err) {
            expect(true).toEqual(false);
          }
        },
        response: (err, response) => {
          if (err) {
            expect(true).toEqual(false);
          }
        },
      },
    });

    const instanceGet = await instance.get("/todos/1");

    expect(instanceGet.data).toEqual({ method: "get" });
  });

  it("shoud possible to change headers on interceptors", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));
    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        request: (err, request) => {
          request.headers.set("access_token", "Bearer 123");
        },
      },
    });
    instance.get("/todos/1");
    const lastCall = fetchMock?.mock?.lastCall?.at(0) as Request;
    expect(lastCall?.headers.get("access_token")).toEqual("Bearer 123");
  });

  it("shoud execute error interceptor", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      }),
      {
        status: 400,
      }
    );
    try {
      await post(
        "http://localhost:5000",
        {
          body: {
            test: "test",
          },
        },
        {
          interceptors: {
            response: (err, response) => {
              expect(err.message).toEqual("Bad Request");
            },
          },
        }
      );
    } catch (error: any) {
      expect(error.message).toEqual("Bad Request");
    }
  });

  it("shoud interceptors call first on success request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));
    let hasResolved = false;

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        request: (err, request) => (hasResolved = true),
      },
    });
    instance
      .get("/todos/1")
      .then(() => expect(hasResolved).toEqual(true));
  });

  it("shoud interceptors call first on unsuccess request", async () => {
    fetchMock.mockResponseOnce("", {
      status: 400,
    });
    let hasResolved = false;

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        response: (err, request) => (hasResolved = true),
      },
    });
    instance
      .get("/todos/1")
      .catch(() => expect(hasResolved).toEqual(true));
  });
});
