// src/__test__/shopContext.test.js
import React from "react";
import { renderHook, act } from "@testing-library/react";

// --- Mocks (defined BEFORE imports) ---
// 1) Mock your Vite-style config module to avoid `import.meta.env`
jest.mock(
  "../config/firebase",
  () => ({
    __esModule: true,
    default: {}, // pretend Firebase app instance
  }),
  { virtual: true }
);

// 2) Mock Realtime Database APIs
const mockUnsub = jest.fn();
const sampleData = {
  p1: { name: "Alpha Shoe", category: "Shoes" },
  p2: { name: "Beta Bag", category: "Bags" },
  p3: { name: "Gamma Shoe", category: "Shoes" },
};

jest.mock("firebase/database", () => {
  const getDatabase = jest.fn(() => ({}));
  const ref = jest.fn((_db, path) => ({ path }));
  const onValue = jest.fn((_ref, cb) => {
    // Immediately deliver a snapshot; return unsubscribe fn
    cb({ val: () => sampleData });
    return mockUnsub;
  });
  return { getDatabase, ref, onValue };
});

// Now import the SUT
import app from "../config/firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { ShopProvider, useShop } from "../contexts/ShopContext";

describe("ShopContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => <ShopProvider>{children}</ShopProvider>;

  test("loads products on mount and exposes filteredProducts", () => {
    const { result } = renderHook(() => useShop(), { wrapper });

    // All products visible by default (category "All", empty search)
    expect(result.current.filteredProducts).toHaveLength(3);

    // getDatabase called with the mocked app; ref targets "products"; onValue subscribed
    expect(getDatabase).toHaveBeenCalledWith(app);
    expect(ref).toHaveBeenCalledWith(expect.any(Object), "products");
    expect(onValue).toHaveBeenCalled();
  });

  test("filters by category", () => {
    const { result } = renderHook(() => useShop(), { wrapper });

    act(() => {
      result.current.setSelectedCategory("Shoes");
    });
    // Only the two shoe items should remain
    expect(result.current.filteredProducts.map(p => p.name)).toEqual(
      expect.arrayContaining(["Alpha Shoe", "Gamma Shoe"])
    );
    expect(result.current.filteredProducts).toHaveLength(2);
  });

  test("filters by search term (case-insensitive)", () => {
    const { result } = renderHook(() => useShop(), { wrapper });

    act(() => {
      result.current.setSearchTerm("beta");
    });
    expect(result.current.filteredProducts).toEqual([
      { name: "Beta Bag", category: "Bags" },
    ]);

    // Combine with category filter -> zero results
    act(() => {
      result.current.setSelectedCategory("Shoes");
    });
    expect(result.current.filteredProducts).toEqual([]);
  });

  test("unsubscribes from database on unmount", () => {
    const { unmount } = renderHook(() => useShop(), { wrapper });
    unmount();
    expect(mockUnsub).toHaveBeenCalledTimes(1);
  });
});
