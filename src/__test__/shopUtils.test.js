// src/__test__/shopUtils.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { renderStars } from "../utils/shopUtils";

const getStarsText = rating => {
  render(<div data-testid="stars">{renderStars(rating)}</div>);
  return screen.getByTestId("stars").textContent;
};

const countChar = (str, ch) => (str.match(new RegExp(ch, "g")) || []).length;

describe("renderStars", () => {
  test("0 => five empty stars", () => {
    const s = getStarsText(0);
    expect(s).toBe("☆☆☆☆☆");
    expect(s.length).toBe(5);
    expect(countChar(s, "★")).toBe(0);
    expect(countChar(s, "☆")).toBe(5);
  });

  test("5 => five full stars", () => {
    const s = getStarsText(5);
    expect(s).toBe("★★★★★");
    expect(s.length).toBe(5);
    expect(countChar(s, "★")).toBe(5);
    expect(countChar(s, "☆")).toBe(0);
  });

  test("integer 3 => three full, two empty", () => {
    const s = getStarsText(3);
    expect(s).toBe("★★★☆☆");
    expect(s.length).toBe(5);
    expect(countChar(s, "★")).toBe(3);
    expect(countChar(s, "☆")).toBe(2);
  });

  test("non-integer 3.2 => three full, two empty (same visual as 3)", () => {
    const s = getStarsText(3.2);
    expect(s).toBe("★★★☆☆");
    expect(s.length).toBe(5);
    expect(countChar(s, "★")).toBe(3);
    expect(countChar(s, "☆")).toBe(2);
  });

  test("4.5 => four full, one empty (half currently rendered as empty)", () => {
    const s = getStarsText(4.5);
    expect(s).toBe("★★★★☆");
    expect(s.length).toBe(5);
    expect(countChar(s, "★")).toBe(4);
    expect(countChar(s, "☆")).toBe(1);
  });
});
