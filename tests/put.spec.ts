import { put } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("interceptors", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

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
});
