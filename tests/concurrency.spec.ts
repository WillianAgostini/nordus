import { create } from "../src";
import { FetchMock } from "jest-fetch-mock";

describe("concurrency", () => {
  const fetchMock = fetch as FetchMock;
  beforeAll(() => fetchMock.enableMocks());
  beforeEach(() => fetchMock.resetMocks());

  it("success get using create instance eith concurrency", async () => {
    fetchMock.mockResponses(
      JSON.stringify({ method: "get" }),
      JSON.stringify({ method: "post" }),
      JSON.stringify({ method: "put" }),
      JSON.stringify({ method: "patch" }),
      JSON.stringify({ method: "del" }),
    );

    const instance = create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "json",
    });

    const [instanceGet, instancePost, instancePut, instancePatch, instanceDel] =
      await Promise.all([
        instance.get("todos/1"),
        instance.post("todos/1", {}),
        instance.put("todos/1", {}),
        instance.patch("todos/1", {}),
        instance.del("todos/1"),
      ]);

    expect(instanceGet.data).toEqual({ method: "get" });
    expect(instancePost.data).toEqual({ method: "post" });
    expect(instancePut.data).toEqual({ method: "put" });
    expect(instancePatch.data).toEqual({ method: "patch" });
    expect(instanceDel.data).toEqual({ method: "del" });
  });
});
