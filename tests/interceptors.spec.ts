import { create, post } from "../src";
import { FetchMock } from "jest-fetch-mock";
import { InterceptorRequest, InterceptorResponse } from "../src/request";

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
    await instance.get("/todos/1");
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
      },
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
        },
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

  it("shoud allow to add many interceptors for request", async () => {
    fetchMock.mockResponseOnce("", {
      status: 400,
    });

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        request: [firstInterceptor, secondInterceptor],
      },
    });

    instance.get("/todos/1").catch(() => expect(textInterceptor).toEqual("12"));
  });

  it("shoud allow to add many interceptors for response", async () => {
    fetchMock.mockResponseOnce("", {
      status: 200,
    });

    let textInterceptor = "";
    const firstInterceptor: InterceptorResponse = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorResponse = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        response: [firstInterceptor, secondInterceptor],
      },
    });

    instance.get("/todos/1").catch(() => expect(textInterceptor).toEqual("12"));
  });

  it("shoud allow to add many interceptors for response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorResponse = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorResponse = () => {
      textInterceptor += "2";
    };
    const thirdInterceptor: InterceptorResponse = () => {
      textInterceptor += "3";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        response: [firstInterceptor, secondInterceptor],
      },
    });

    await instance.get("/todos/1", {
      interceptors: {
        response: thirdInterceptor,
      },
    });
    expect(textInterceptor).toEqual("123");
  });

  it("shoud allow to add many interceptors for request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };
    const thirdInterceptor: InterceptorRequest = () => {
      textInterceptor += "3";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        request: [firstInterceptor, secondInterceptor],
      },
    });

    await instance.get("/todos/1", {
      interceptors: {
        request: thirdInterceptor,
      },
    });
    expect(textInterceptor).toEqual("123");
  });

  it("shoud allow to add many interceptors for request and response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };
    const thirdInterceptor: InterceptorResponse = () => {
      textInterceptor += "3";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        request: [firstInterceptor, secondInterceptor],
      },
    });

    await instance.get("/todos/1", {
      interceptors: {
        response: thirdInterceptor,
      },
    });
    expect(textInterceptor).toEqual("123");
  });

  it("shoud allow to add interceptors by use and parameter for request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
    });
    instance.interceptors.request.use(firstInterceptor);
    await instance.get("/todos/1", {
      interceptors: {
        request: secondInterceptor,
      },
    });
    expect(textInterceptor).toEqual("12");
  });

  it("shoud allow to add interceptors by use and parameter for request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
    });
    const id = instance.interceptors.request.use(firstInterceptor);
    instance.interceptors.request.eject(id);

    await instance.get("/todos/1", {
      interceptors: {
        request: secondInterceptor,
      },
    });
    expect(textInterceptor).toEqual("2");
  });

  it("shoud allow to clear interceptors for request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        request: [firstInterceptor],
      },
    });
    instance.interceptors.request.use(secondInterceptor);
    instance.interceptors.request.clear();

    await instance.get("/todos/1");
    expect(textInterceptor).toEqual("");
  });

  it("shoud allow to add interceptors by use and parameter for response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
    });
    instance.interceptors.request.use(firstInterceptor);
    await instance.get("/todos/1", {
      interceptors: {
        request: secondInterceptor,
      },
    });
    expect(textInterceptor).toEqual("12");
  });

  it("shoud allow to add interceptors by use and parameter for response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
    });
    const id = instance.interceptors.request.use(firstInterceptor);
    instance.interceptors.request.eject(id);

    await instance.get("/todos/1", {
      interceptors: {
        request: secondInterceptor,
      },
    });
    expect(textInterceptor).toEqual("2");
  });

  it("shoud allow to clear interceptors for response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    let textInterceptor = "";
    const firstInterceptor: InterceptorRequest = () => {
      textInterceptor += "1";
    };
    const secondInterceptor: InterceptorRequest = () => {
      textInterceptor += "2";
    };

    const instance = create({
      baseURL: "http://localhost:5000",
      interceptors: {
        request: [firstInterceptor],
      },
    });
    instance.interceptors.request.use(secondInterceptor);
    instance.interceptors.request.clear();

    await instance.get("/todos/1");
    expect(textInterceptor).toEqual("");
  });
});
