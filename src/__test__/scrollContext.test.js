// src/__test__/ScrollContext.test.jsx
import React from "react";
import { render, act } from "@testing-library/react";

// ---- Mock useScroll BEFORE importing the context under test ----
jest.mock("../hooks/useScroll", () => {
  let value = false;
  const useScroll = jest.fn(() => value);
  useScroll.__set = v => {
    value = v;
  };
  return { __esModule: true, default: useScroll };
});

import useScroll from "../hooks/useScroll";
// Adjust this path if yours is "context/ScrollContext" (singular)
import { ScrollProvider, useScrollContext } from "../contexts/ScrollContext";

// capture helper
let ctxRef;
const Capture = () => {
  ctxRef = useScrollContext();
  return null;
};

describe("ScrollContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ctxRef = undefined;
    // default the mocked hook to false for each test
    useScroll.__set(false);
  });

  test("useScrollContext returns undefined when used outside provider", () => {
    render(<Capture />);
    expect(ctxRef).toBeUndefined();
  });

  test("ScrollProvider calls useScroll with threshold 10", () => {
    render(
      <ScrollProvider>
        <Capture />
      </ScrollProvider>
    );
    expect(useScroll).toHaveBeenCalledTimes(1);
    expect(useScroll).toHaveBeenCalledWith(10);
  });

  test("provides { isScrolled } from useScroll (false -> true update)", () => {
    const { rerender } = render(
      <ScrollProvider>
        <Capture />
      </ScrollProvider>
    );

    // initial (mocked false)
    expect(ctxRef).toEqual({ isScrolled: false });

    // flip the mocked hook return to true and force a re-render
    act(() => {
      useScroll.__set(true);
    });
    rerender(
      <ScrollProvider>
        <Capture />
      </ScrollProvider>
    );

    expect(ctxRef).toEqual({ isScrolled: true });
  });
});
