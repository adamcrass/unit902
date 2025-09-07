// src/__test__/useScroll.test.jsx
import { renderHook, act } from "@testing-library/react";
import useScroll from "../hooks/useScroll"; // ← change to '../../hooks/useScroll' if needed

describe("useScroll", () => {
  let originalScrollY;

  beforeEach(() => {
    originalScrollY = window.scrollY;
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: originalScrollY,
    });
  });

  test("default threshold (50): false at top, true when scrolled > 50, false when back to <= 50", () => {
    const { result } = renderHook(() => useScroll()); // threshold = 50

    // Initially false
    expect(result.current).toBe(false);

    // Scroll to 25 -> still false
    act(() => {
      window.scrollY = 25;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);

    // Scroll to 51 -> true
    act(() => {
      window.scrollY = 51;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);

    // Scroll to exactly 50 -> false (strict >)
    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);
  });

  test("respects provided threshold and updates on rerender", () => {
    // Start below first threshold
    window.scrollY = 120;

    const { result, rerender } = renderHook(({ t }) => useScroll(t), {
      initialProps: { t: 100 },
    });

    // Trigger initial compute
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true); // 120 > 100

    // Increase threshold to 150 -> should become false after next scroll event
    rerender({ t: 150 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false); // 120 > 150 is false
  });

  test("adds and removes scroll listener", () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    const removeSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScroll());

    expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  test("does not auto-compute on mount until a scroll event occurs", () => {
    // If already scrolled on mount, state stays false until a scroll event
    window.scrollY = 200;
    const { result } = renderHook(() => useScroll(100));
    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);
  });
});
