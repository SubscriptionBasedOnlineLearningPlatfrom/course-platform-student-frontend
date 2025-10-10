// src/__tests__/contexts/ApiContext.test.js
import React from "react";
import { renderHook } from "@testing-library/react";
import { ApiProvider, useApi } from "@/contexts/ApiContext";

// ✅ Mock axios before importing anything else
jest.mock("axios", () => ({
  create: () => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  }),
}));

describe("ApiContext-test functions", () => {
  test("provides expected API functions", () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: ApiProvider,
    });

    // check that context provides certain functions
    expect(result.current).toHaveProperty("getCourseContent");
    expect(result.current).toHaveProperty("updateProgress");
    expect(result.current).toHaveProperty("BackendAPI");
  });
});
