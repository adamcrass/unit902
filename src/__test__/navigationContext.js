// src/__test__/NavigationContext.test.jsx
import React from "react";
import { render, act } from "@testing-library/react";

// ----- mockable vars must be defined BEFORE jest.mock -----
let mockPathname = "/";
const mockNavigate = jest.fn();

// Router mocks
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

// AuthContext mock
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Hooks & utils mocks
jest.mock("../hooks/useActiveSection", () => {
  let active = "";
  const useActiveSection = jest.fn(() => active);
  useActiveSection.__set = v => {
    active = v;
  };
  return { useActiveSection };
});

jest.mock("../hooks/useBodyScrollLock", () => ({
  useBodyScrollLock: jest.fn(),
}));

jest.mock("../utils/smoothScroll", () => ({
  scrollToElement: jest.fn(),
}));

// Import after mocks
import {
  NavigationProvider,
  useNavigation,
} from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";
import { useActiveSection } from "../hooks/useActiveSection";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { scrollToElement } from "../utils/smoothScroll";

// capture context
let navRef;
const Capture = () => {
  navRef = useNavigation();
  return null;
};

describe("NavigationContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    navRef = undefined;
    mockPathname = "/";

    // default auth mock
    useAuth.mockReturnValue({
      user: { uid: "u1" },
      logout: jest.fn().mockResolvedValue({ error: null }),
    });

    // default active section = none
    useActiveSection.__set("");

    // stub scrollTo
    window.scrollTo = jest.fn();
  });

  test("throws if useNavigation is used outside provider (no console noise)", () => {
    const Outside = () => {
      useNavigation();
      return null;
    };

    // Silence ONLY the expected error for this assertion; let other errors through.
    const originalError = console.error;
    const errSpy = jest
      .spyOn(console, "error")
      .mockImplementation((...args) => {
        const msg = args.map(String).join(" ");
        if (
          msg.includes(
            "useNavigation must be used within a NavigationProvider"
          ) ||
          msg.includes("The above error occurred in the <Outside> component")
        ) {
          return; // swallow expected noise from React/JSDOM for this test
        }
        originalError(...args);
      });

    try {
      expect(() => render(<Outside />)).toThrow(
        "useNavigation must be used within a NavigationProvider"
      );
    } finally {
      errSpy.mockRestore();
    }
  });

  test("provides state and helpers; isActive logic for home and hash", () => {
    render(
      <NavigationProvider>
        <Capture />
      </NavigationProvider>
    );

    // home, no active section
    expect(navRef.location.pathname).toBe("/");
    expect(navRef.isActive("/")).toBe(true);
    expect(navRef.isActive("#about")).toBe(false);

    // when a section is active
    act(() => useActiveSection.__set("about"));
    act(() => navRef.toggleMobileMenu()); // poke rerender
    act(() => navRef.closeMobileMenu());

    expect(navRef.isActive("/")).toBe(false);
    expect(navRef.isActive("#about")).toBe(true);

    // regular route
    mockPathname = "/profile";
    act(() => navRef.toggleMobileMenu());
    act(() => navRef.closeMobileMenu());

    expect(navRef.isActive("/profile")).toBe(true);
    expect(navRef.isActive("/")).toBe(false);
  });

  test("toggleMobileMenu / closeMobileMenu / overlay click", () => {
    render(
      <NavigationProvider>
        <Capture />
      </NavigationProvider>
    );

    expect(navRef.isMobileMenuOpen).toBe(false);

    act(() => navRef.toggleMobileMenu());
    expect(navRef.isMobileMenuOpen).toBe(true);

    // overlay click closes when target === currentTarget
    act(() => navRef.handleOverlayClick({ target: 1, currentTarget: 1 }));
    expect(navRef.isMobileMenuOpen).toBe(false);

    act(() => navRef.toggleMobileMenu());
    expect(navRef.isMobileMenuOpen).toBe(true);
    act(() => navRef.handleOverlayClick({ target: 1, currentTarget: 2 }));
    expect(navRef.isMobileMenuOpen).toBe(true);

    // body scroll lock called with latest state
    expect(useBodyScrollLock).toHaveBeenCalled();
    const lastArg =
      useBodyScrollLock.mock.calls[useBodyScrollLock.mock.calls.length - 1][0];
    expect(lastArg).toBe(true);
  });

  test("handleLogin and handleProfile navigate, scroll to top, close menu", () => {
    render(
      <NavigationProvider>
        <Capture />
      </NavigationProvider>
    );

    act(() => navRef.toggleMobileMenu());
    act(() => navRef.handleLogin());
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
    expect(navRef.isMobileMenuOpen).toBe(false);

    act(() => navRef.toggleMobileMenu());
    act(() => navRef.handleProfile());
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
    expect(navRef.isMobileMenuOpen).toBe(false);
  });

  test("handleLogout navigates home & scrolls on success; always closes menu", async () => {
    const logoutMock = jest.fn().mockResolvedValue({ error: null });
    useAuth.mockReturnValue({ user: { uid: "u1" }, logout: logoutMock });

    render(
      <NavigationProvider>
        <Capture />
      </NavigationProvider>
    );

    act(() => navRef.toggleMobileMenu());
    await act(async () => {
      await navRef.handleLogout();
    });

    expect(logoutMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
    expect(navRef.isMobileMenuOpen).toBe(false);

    // failure path: no navigate/scroll, still closes
    const badLogout = jest.fn().mockResolvedValue({ error: "boom" });
    useAuth.mockReturnValue({ user: { uid: "u1" }, logout: badLogout });

    act(() => navRef.toggleMobileMenu());
    await act(async () => {
      await navRef.handleLogout();
    });

    expect(badLogout).toHaveBeenCalled();
    // should not add extra navigate-to-home call
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(navRef.isMobileMenuOpen).toBe(false);
  });

  test("handleNavigation: hash on home scrolls; hash off home navigates; regular path navigates", () => {
    render(
      <NavigationProvider>
        <Capture />
      </NavigationProvider>
    );

    // hash on home
    act(() => navRef.toggleMobileMenu());
    act(() => navRef.handleNavigation("#about"));
    expect(scrollToElement).toHaveBeenCalledWith("about", 40);
    expect(navRef.isMobileMenuOpen).toBe(false);

    // hash when not on home
    mockPathname = "/profile";
    act(() => navRef.toggleMobileMenu());
    act(() => navRef.handleNavigation("#contact"));
    expect(mockNavigate).toHaveBeenCalledWith("/#contact");
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
    expect(navRef.isMobileMenuOpen).toBe(false);

    // regular path
    act(() => navRef.toggleMobileMenu());
    act(() => navRef.handleNavigation("/settings"));
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
    expect(navRef.isMobileMenuOpen).toBe(false);
  });
});
