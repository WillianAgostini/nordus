import { get } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("cancellation", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("success stop request with AbortController", (done) => {
    fetchMock.mockResponseOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            body: JSON.stringify({ data: "ok" }),
            status: 200,
          });
        }, 1000);
      });
    });

    const abortController = new AbortController();
    get("http://localhost:5000", {
      responseType: "json",
      signal: abortController.signal,
    })
      .then(() => {
        expect(false).toBe(true);
      })
      .catch((error) => {
        expect(error.name).toEqual("AbortError");
      })
      .finally(() => {
        done();
      });

    abortController.abort();
  });
});
