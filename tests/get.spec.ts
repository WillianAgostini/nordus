import { get } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("interceptors", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

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
});
