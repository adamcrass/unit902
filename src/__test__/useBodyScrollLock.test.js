// src/__test__/useBodyScrollLock.test.jsx
import { renderHook } from "@testing-library/react";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

describe("useBodyScrollLock", () => {
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;

  let originalInnerWidth;
  let prevClientWidthDescriptor;

  beforeEach(() => {
    // Reset any prev styles
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;

    // Stub layout measurements so scrollbarWidth = 20
    originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1000,
    });

    // Make clientWidth return 980 on the <html> element
    prevClientWidthDescriptor = Object.getOwnPropertyDescriptor(
      document.documentElement,
      "clientWidth"
    );
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      get: () => 980,
    });
  });

  afterEach(() => {
    // Restore stubs
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalInnerWidth,
    });

    if (prevClientWidthDescriptor) {
      Object.defineProperty(
        document.documentElement,
        "clientWidth",
        prevClientWidthDescriptor
      );
    } else {
      // Remove our override so prototype getter is used again
      // (works because we set configurable: true)
      // eslint-disable-next-line no-param-reassign
      delete document.documentElement.clientWidth;
    }

    // Clean styles
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  });

  test("locks scroll and sets padding when isLocked = true", () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("20px"); // 1000 - 980

    // Cleanup on unmount restores previous values
    unmount();
    expect(document.body.style.overflow).toBe(originalOverflow);
    expect(document.body.style.paddingRight).toBe(originalPaddingRight);
  });

  test("restores styles when toggling from true -> false", () => {
    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: { locked: true },
    });

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("20px");

    // Toggle off runs the cleanup from the previous effect
    rerender({ locked: false });
    expect(document.body.style.overflow).toBe(originalOverflow);
    expect(document.body.style.paddingRight).toBe(originalPaddingRight);
  });

  test("does nothing when isLocked = false", () => {
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).toBe(originalOverflow);
    expect(document.body.style.paddingRight).toBe(originalPaddingRight);
  });
});
