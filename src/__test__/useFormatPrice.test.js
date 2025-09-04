import { renderHook } from "@testing-library/react";
import {
  useFormatPrice,
  dollarsToCents,
  centsToDollars,
} from "../hooks/useFormatPrice";

describe("useFormatPrice hook", () => {
  test("formats cents to dollars correctly", () => {
    const { result } = renderHook(() => useFormatPrice(1299));

    expect(result.current.formatted).toBe("$12.99");
    expect(result.current.dollars).toBe(12);
    expect(result.current.cents).toBe(99);
    expect(result.current.raw).toBe(12.99);
  });

  test("handles zero cents", () => {
    const { result } = renderHook(() => useFormatPrice(0));

    expect(result.current.formatted).toBe("$0.00");
    expect(result.current.dollars).toBe(0);
    expect(result.current.cents).toBe(0);
    expect(result.current.raw).toBe(0);
  });

  test("handles null/undefined values", () => {
    const { result } = renderHook(() => useFormatPrice(null));

    expect(result.current.formatted).toBe("$0.00");
    expect(result.current.dollars).toBe(0);
    expect(result.current.cents).toBe(0);
    expect(result.current.raw).toBe(0);
  });

  test("handles large amounts", () => {
    const { result } = renderHook(() => useFormatPrice(999999));

    expect(result.current.formatted).toBe("$9,999.99");
    expect(result.current.dollars).toBe(9999);
    expect(result.current.cents).toBe(99);
    expect(result.current.raw).toBe(9999.99);
  });

  test("handles different currencies", () => {
    const { result } = renderHook(() => useFormatPrice(1299, "EUR", "de-DE"));

    expect(result.current.formatted).toContain("12,99");
    expect(result.current.raw).toBe(12.99);
  });
});

describe("utility functions", () => {
  test("dollarsToCents converts correctly", () => {
    expect(dollarsToCents(12.99)).toBe(1299);
    expect(dollarsToCents(0)).toBe(0);
    expect(dollarsToCents(null)).toBe(0);
  });

  test("centsToDollars converts correctly", () => {
    expect(centsToDollars(1299)).toBe(12.99);
    expect(centsToDollars(0)).toBe(0);
    expect(centsToDollars(null)).toBe(0);
  });
});
