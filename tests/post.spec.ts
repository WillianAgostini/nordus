import { get, post } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("interceptors", () => {
  const fetchMock = fetch as FetchMock;
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
});
