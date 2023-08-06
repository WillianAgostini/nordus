import { get } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("timeout", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("throw timeout exceeded", async () => {
    fetchMock.mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(JSON.stringify({ body: "ok" })), 300),
        ),
    );

    try {
      await get("http://localhost:5000/todos/1", {
        timeout: 100,
      });
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error.message).toEqual("The operation was aborted. ");
    }
  });
});
