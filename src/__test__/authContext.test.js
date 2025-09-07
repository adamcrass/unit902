// src/__test__/authContext.test.jsx
import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

// --- Mocks (pure JS, no TS casts) ---
const mockUnsubscribe = jest.fn();

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock("../config/firebase", () => ({
  auth: {},
  googleProvider: {},
}));

// pull the mocked fns
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

// helper to capture context
let ctxRef;
const CaptureAuth = () => {
  ctxRef = useAuth();
  return null;
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ctxRef = undefined;
  });

  test("hides children while loading, then shows after auth state resolves; unsubscribes on unmount", async () => {
    let savedCb;
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      savedCb = cb; // stay loading until we invoke
      return mockUnsubscribe;
    });

    const { queryByTestId, unmount } = render(
      <AuthProvider>
        <div data-testid="child">child</div>
      </AuthProvider>
    );

    expect(queryByTestId("child")).toBeNull(); // loading -> hidden

    await act(async () => {
      savedCb(null); // set user=null and loading=false
    });
    expect(queryByTestId("child")).not.toBeNull();

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  test("exposes user and helpers via useAuth once loading is done", async () => {
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb({ uid: "u1", email: "a@b.com" });
      return mockUnsubscribe;
    });

    render(
      <AuthProvider>
        <CaptureAuth />
      </AuthProvider>
    );

    await waitFor(() => expect(ctxRef).toBeDefined());
    expect(ctxRef.user).toEqual({ uid: "u1", email: "a@b.com" });
    expect(ctxRef.loading).toBe(false);

    expect(typeof ctxRef.signInWithEmail).toBe("function");
    expect(typeof ctxRef.signUpWithEmail).toBe("function");
    expect(typeof ctxRef.signInWithGoogle).toBe("function");
    expect(typeof ctxRef.logout).toBe("function");
    expect(typeof ctxRef.resetPassword).toBe("function");
  });

  test("signInWithEmail success & failure", async () => {
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(null);
      return mockUnsubscribe;
    });

    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });

    render(
      <AuthProvider>
        <CaptureAuth />
      </AuthProvider>
    );
    await waitFor(() => expect(ctxRef).toBeDefined());

    await expect(ctxRef.signInWithEmail("e@x.com", "pw")).resolves.toEqual({
      user: { uid: "123" },
      error: null,
    });

    signInWithEmailAndPassword.mockRejectedValue(new Error("bad creds"));

    await expect(ctxRef.signInWithEmail("e@x.com", "pw")).resolves.toEqual({
      user: null,
      error: "bad creds",
    });
  });

  test("signUpWithEmail success & failure", async () => {
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(null);
      return mockUnsubscribe;
    });

    createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "new" } });

    render(
      <AuthProvider>
        <CaptureAuth />
      </AuthProvider>
    );
    await waitFor(() => expect(ctxRef).toBeDefined());

    await expect(ctxRef.signUpWithEmail("e@x.com", "pw")).resolves.toEqual({
      user: { uid: "new" },
      error: null,
    });

    createUserWithEmailAndPassword.mockRejectedValue(new Error("exists"));

    await expect(ctxRef.signUpWithEmail("e@x.com", "pw")).resolves.toEqual({
      user: null,
      error: "exists",
    });
  });

  test("signInWithGoogle success & failure", async () => {
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(null);
      return mockUnsubscribe;
    });

    signInWithPopup.mockResolvedValue({ user: { uid: "g" } });

    render(
      <AuthProvider>
        <CaptureAuth />
      </AuthProvider>
    );
    await waitFor(() => expect(ctxRef).toBeDefined());

    await expect(ctxRef.signInWithGoogle()).resolves.toEqual({
      user: { uid: "g" },
      error: null,
    });

    signInWithPopup.mockRejectedValue(new Error("popup closed"));

    await expect(ctxRef.signInWithGoogle()).resolves.toEqual({
      user: null,
      error: "popup closed",
    });
  });

  test("logout success & failure", async () => {
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(null);
      return mockUnsubscribe;
    });

    signOut.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <CaptureAuth />
      </AuthProvider>
    );
    await waitFor(() => expect(ctxRef).toBeDefined());

    await expect(ctxRef.logout()).resolves.toEqual({ error: null });

    signOut.mockRejectedValue(new Error("network"));

    await expect(ctxRef.logout()).resolves.toEqual({ error: "network" });
  });

  test("resetPassword success & failure", async () => {
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(null);
      return mockUnsubscribe;
    });

    sendPasswordResetEmail.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <CaptureAuth />
      </AuthProvider>
    );
    await waitFor(() => expect(ctxRef).toBeDefined());

    await expect(ctxRef.resetPassword("e@x.com")).resolves.toEqual({
      error: null,
    });

    sendPasswordResetEmail.mockRejectedValue(new Error("no user"));

    await expect(ctxRef.resetPassword("e@x.com")).resolves.toEqual({
      error: "no user",
    });
  });
});
