import { get, post } from "../src/index";
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

  it("should throw Unknown response type", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    try {
      await get("http://localhost:5000", {
        responseType: "unknown",
      });
    } catch (error) {
      expect(error.message).toEqual("Unknown response type: unknown");
    }
  });

  it("success get with blob response", async () => {
    fetchMock.mockResponseOnce(new Blob(["test"]));
    const response = await get("http://localhost:5000", {
      responseType: "blob",
    });

    expect(String(response.data)).toEqual(String(new Blob(["test"])));
  });

  it("success get with arraybuffer response", async () => {
    fetchMock.mockResponseOnce(new ArrayBuffer(4));
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
    } catch (error) {
      expect(error.message).toEqual("Bad Request");
    }
  });
});
