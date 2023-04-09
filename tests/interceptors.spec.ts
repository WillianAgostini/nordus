import { create, post } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("interceptors", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

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
    instance.get("/todos/1").then(() => expect(hasResolved).toEqual(true));
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
    instance.get("/todos/1").catch(() => expect(hasResolved).toEqual(true));
  });
});
