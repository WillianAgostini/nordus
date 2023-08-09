import { post } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("FormData", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("success get with formData response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ test: "test" }));

    const formData = new FormData();
    formData.append("test", "test");

    const data = new URLSearchParams();
    for (const pair of formData) {
      data.append(pair[0], pair[1].toString());
    }

    await post("http://localhost:5000", data);

    const lastCall = fetchMock?.mock?.lastCall?.at(0) as Request;
    const body = await lastCall?.text();
    expect(body).toEqual("test=test");
  });
});
