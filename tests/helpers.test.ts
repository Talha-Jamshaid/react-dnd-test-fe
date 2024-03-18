import { COLUMN_WIDTH, GUTTER_SIZE } from "../src/constants";
import {
  moduleW2LocalWidth,
  checkCollision,
  calculateLeft,
} from "../src/helpers";

describe("helpers", () => {
  test("moduleW2LocalWidth", () => {
    const w = 2;
    expect(moduleW2LocalWidth(w)).toEqual(w * COLUMN_WIDTH - GUTTER_SIZE);
  });
});

describe("checkCollision", () => {
  // Define sample modules for testing
  const module1 = {
    id: 1,
    coord: { x: 94.5, y: 100, w: 2, h: 100 }, // Sample coordinates for module 1
  };

  const module2 = {
    id: 2,
    coord: { x: 150, y: 150, w: 3, h: 100 }, // Sample coordinates for module 2
  };
  // Test case 1: Modules are overlapping
  it("should return true when modules are overlapping", () => {
    const result = checkCollision(module1, module2);
    expect(result).toBe(true);
  });

  // Test case 2: Modules are not overlapping
  it("should return false when modules are not overlapping", () => {
    // Adjust coordinates so that modules do not overlap
    module2.coord.x = 676;
    module2.coord.y = 200;

    const result = checkCollision(module1, module2);
    expect(result).toBe(false);
  });
});
describe("calculateLeftIndex", () => {
  // Test case 1: Movement and width within bounds
  it("should calculate the left index within bounds", () => {
    const movement = 200; // Sample movement
    const width = 2; // Sample width

    // Expected calculation result
    const expectedIndex = COLUMN_WIDTH * 2 + GUTTER_SIZE;

    // Calculate the left index
    const result = calculateLeft(movement, width);

    // Assertion
    expect(result).toBe(expectedIndex);
  });

  // Test case 2: Movement exceeding bounds
  it("should calculate the left index with movement exceeding bounds", () => {
    const movement = 1300; // Sample movement exceeding bounds
    const width = 3; // Sample width

    // Expected calculation result (movement exceeds bounds, so it should wrap around)
    const expectedIndex = COLUMN_WIDTH * 9 + GUTTER_SIZE;

    // Calculate the left index
    const result = calculateLeft(movement, width);

    // Assertion
    expect(result).toBe(expectedIndex);
  });
});
