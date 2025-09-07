import { renderHook, act } from "@testing-library/react";
import React from "react";
import { useActiveSection } from "../hooks/useActiveSection";

const createSection = (id, top) => {
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  Object.defineProperty(el, "offsetTop", {
    configurable: true,
    value: top,
  });
  return el;
};

describe("useActiveSection", () => {
  const sectionIds = ["section1", "section2", "section3"];
  const offset = 100;

  beforeEach(() => {
    // jsdom doesn't lay out, so we stub scrollY and offsetTop by hand
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });

    // build fake page structure
    createSection("section1", 0);
    createSection("section2", 500);
    createSection("section3", 1000);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("no active section when at very top (< offset)", () => {
    const { result } = renderHook(() => useActiveSection(sectionIds, offset));
    expect(result.current).toBe("");
  });

  test("activates the correct section as you scroll down", () => {
    const { result } = renderHook(() => useActiveSection(sectionIds, offset));

    // Scroll to between section1 and section2
    act(() => {
      window.scrollY = 150; // scrollPosition = 250
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("section1");

    // Scroll to section2 territory
    act(() => {
      window.scrollY = 450; // scrollPosition = 550 >= 500
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("section2");

    // Scroll to section3 territory
    act(() => {
      window.scrollY = 900; // scrollPosition = 1000 >= 1000
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("section3");

    // Scroll back near the top: should clear when < offset
    act(() => {
      window.scrollY = 50; // < offset
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("");
  });

  test("computes initial active section on mount (already scrolled)", () => {
    window.scrollY = 600; // scrollPosition = 700 -> section2
    const { result } = renderHook(() => useActiveSection(sectionIds, offset));
    expect(result.current).toBe("section2");
  });

  test("adds and removes the scroll listener", () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    const removeSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useActiveSection(sectionIds, offset));

    expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
