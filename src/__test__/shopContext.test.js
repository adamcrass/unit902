// src/__test__/ShopContext.test.jsx
import React from "react";
import { render, act } from "@testing-library/react";

// ---- Mock product data BEFORE importing the context under test ----
// This path should resolve to src/data/mockProducts from this test file.
jest.mock("../data/mockProducts", () => ({
  __esModule: true,
  default: [
    { id: 1, name: "Blue Shirt", category: "Shirts" },
    { id: 2, name: "Pro Blue Shirt", category: "Shirts" },
    { id: 3, name: "Red Hat", category: "Hats" },
    { id: 4, name: "Blue Cap", category: "Hats" },
    { id: 5, name: "Running Shoes", category: "Shoes" },
  ],
}));

// ⬇️ update this import if your folder is "context" (singular)
import { ShopProvider, useShop } from "../contexts/ShopContext";

// helper that captures the context value for assertions
let ctxRef;
const Capture = () => {
  ctxRef = useShop();
  return null;
};

const names = () => (ctxRef?.filteredProducts || []).map(p => p.name).sort();

describe("ShopContext", () => {
  beforeEach(() => {
    ctxRef = undefined;
  });

  test("useShop returns undefined when used outside provider", () => {
    render(<Capture />);
    expect(ctxRef).toBeUndefined();
  });

  test("defaults: category 'All', empty search, all products returned", () => {
    render(
      <ShopProvider>
        <Capture />
      </ShopProvider>
    );

    expect(ctxRef.selectedCategory).toBe("All");
    expect(ctxRef.searchTerm).toBe("");
    expect(names()).toEqual([
      "Blue Cap",
      "Blue Shirt",
      "Pro Blue Shirt",
      "Red Hat",
      "Running Shoes",
    ]);
  });

  test("filter by category only", () => {
    render(
      <ShopProvider>
        <Capture />
      </ShopProvider>
    );

    act(() => {
      ctxRef.setSelectedCategory("Hats");
    });
    expect(ctxRef.selectedCategory).toBe("Hats");
    expect(names()).toEqual(["Blue Cap", "Red Hat"]);

    act(() => {
      ctxRef.setSelectedCategory("Shirts");
    });
    expect(names()).toEqual(["Blue Shirt", "Pro Blue Shirt"]);
  });

  test("filter by search only (case-insensitive, substring match)", () => {
    render(
      <ShopProvider>
        <Capture />
      </ShopProvider>
    );

    act(() => {
      ctxRef.setSearchTerm("blue");
    });
    expect(ctxRef.searchTerm).toBe("blue");
    // Blue Shirt, Pro Blue Shirt, Blue Cap
    expect(names()).toEqual(["Blue Cap", "Blue Shirt", "Pro Blue Shirt"]);

    act(() => {
      ctxRef.setSearchTerm("pro"); // matches "Pro Blue Shirt"
    });
    expect(names()).toEqual(["Pro Blue Shirt"]);

    act(() => {
      ctxRef.setSearchTerm("zzz"); // no matches
    });
    expect(names()).toEqual([]);
  });

  test("combined filters: category AND search", () => {
    render(
      <ShopProvider>
        <Capture />
      </ShopProvider>
    );

    act(() => {
      ctxRef.setSelectedCategory("Shirts");
      ctxRef.setSearchTerm("blue");
    });
    // both Shirt items match because both include "Blue"
    expect(names()).toEqual(["Blue Shirt", "Pro Blue Shirt"]);

    act(() => {
      ctxRef.setSearchTerm("pro"); // narrows to only the "Pro Blue Shirt"
    });
    expect(names()).toEqual(["Pro Blue Shirt"]);
  });

  test("unknown category yields empty list (with empty search)", () => {
    render(
      <ShopProvider>
        <Capture />
      </ShopProvider>
    );

    act(() => {
      ctxRef.setSelectedCategory("Bags");
      ctxRef.setSearchTerm("");
    });
    expect(names()).toEqual([]);
  });
});
