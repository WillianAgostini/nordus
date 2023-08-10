import { request } from "../src/index";
import { FetchMock } from "jest-fetch-mock";

const fetchMock = fetch as FetchMock;

describe("request", () => {
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("should throw invalid URL", async () => {
    fetchMock.mockResponseOnce("");
    try {
      await request("/localhost", {
        method: "POST",
      });
    } catch (error) {
      expect(error?.message).toEqual("Invalid URL");
    }
  });

  it("should generate URL with params", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    await request("http://localhost:5000", {
      method: "GET",
      params: {
        test: "test",
      },
    });
    const lastCall = fetchMock?.mock?.lastCall?.at(0) as Request;
    expect(lastCall?.url).toEqual("http://localhost:5000/?test=test");
  });
});
