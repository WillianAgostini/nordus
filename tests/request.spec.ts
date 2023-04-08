import { NordusRequest } from "../src/request";
import { FetchMock } from "jest-fetch-mock";

const fetchMock = fetch as FetchMock;

describe("request", () => {
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("should throw Unknown response type", async () => {
    const nordus = new NordusRequest();
    fetchMock.mockResponseOnce(
      JSON.stringify({
        test: "test",
      })
    );
    try {
      await nordus.request("http://localhost:5000", {
        method: "POST",
        body: {
          test: "test",
        },
      });
    } catch (error) {
      expect(error.message).toEqual("Unknown response type: undefined");
    }
  });

  it("should throw invalid URL", async () => {
    const nordus = new NordusRequest();
    fetchMock.mockResponseOnce("");
    try {
      await nordus.request("/localhost", {
        method: "POST",
      });
    } catch (error) {
      expect(error.message).toEqual("Invalid URL");
    }
  });
});
