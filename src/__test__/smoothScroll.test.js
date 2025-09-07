// src/__test__/smoothScroll.test.js
import {
  scrollToElement,
  handleHashNavigation,
  setupHashNavigation,
} from "../utils/smoothScroll";

describe("smoothScroll utils", () => {
  let originalPageYOffset;
  let scrollToSpy;
  let originalHash;

  const addEl = (id, top) => {
    const el = document.createElement("div");
    el.id = id;
    el.getBoundingClientRect = () => ({ top });
    document.body.appendChild(el);
    return el;
  };

  beforeEach(() => {
    document.body.innerHTML = "";

    originalHash = window.location.hash;
    originalPageYOffset = window.pageYOffset;

    Object.defineProperty(window, "pageYOffset", {
      configurable: true,
      writable: true,
      value: 0,
    });

    scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(window, "pageYOffset", {
      configurable: true,
      writable: true,
      value: originalPageYOffset,
    });
    window.location.hash = originalHash;
    scrollToSpy.mockRestore();
    document.body.innerHTML = "";
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("scrollToElement", () => {
    test("scrolls smoothly to the element with default offset (80)", () => {
      addEl("target", 200);
      window.pageYOffset = 300;

      scrollToElement("target"); // offset 80

      // 200 (rect.top) + 300 (pageYOffset) - 80 = 420
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 420,
        behavior: "smooth",
      });
    });

    test("respects custom offset", () => {
      addEl("target", 200);
      window.pageYOffset = 300;

      scrollToElement("target", 50);

      // 200 + 300 - 50 = 450
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 450,
        behavior: "smooth",
      });
    });

    test("no-op when element not found", () => {
      scrollToElement("missing");
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("handleHashNavigation", () => {
    test("scrolls when hash starts with #", () => {
      addEl("foo", 200);
      window.pageYOffset = 300;

      handleHashNavigation("#foo", 120);

      // 200 + 300 - 120 = 380
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 380,
        behavior: "smooth",
      });
    });

    test("ignores empty/invalid hash", () => {
      handleHashNavigation("");
      handleHashNavigation("no-hash");
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("setupHashNavigation", () => {
    test("sets up load + hashchange listeners and cleans up", () => {
      jest.useFakeTimers();

      // Initial on-load behavior
      addEl("onload", 100);
      window.pageYOffset = 0;
      window.location.hash = "#onload";

      const cleanup = setupHashNavigation(90);

      // Fire load; it defers via setTimeout(100)
      window.dispatchEvent(new Event("load"));
      expect(window.scrollTo).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);

      // 100 + 0 - 90 = 10
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 10,
        behavior: "smooth",
      });

      // Now test hashchange behavior
      scrollToSpy.mockClear();
      addEl("changed", 150);
      window.location.hash = "#changed";
      window.pageYOffset = 20; // any value you like

      window.dispatchEvent(new Event("hashchange"));

      // 150 + 20 - 90 = 80
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 80,
        behavior: "smooth",
      });

      // Cleanup removes listeners
      scrollToSpy.mockClear();
      cleanup();
      window.location.hash = "#ignored";
      window.dispatchEvent(new Event("hashchange"));
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
