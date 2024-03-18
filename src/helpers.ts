import { COLUMN_WIDTH, GUTTER_SIZE, NUM_COLUMNS } from "./constants";
import ModuleInterface from "./types/ModuleInterface";

export const moduleW2LocalWidth = (moduleW: number) =>
  moduleW * COLUMN_WIDTH - GUTTER_SIZE;
export const moduleX2LocalX = (moduleX: number) =>
  moduleW2LocalWidth(moduleX) + GUTTER_SIZE * 2;
export const moduleY2LocalY = (moduleY: number) => moduleY + GUTTER_SIZE;

/**
 * Checks if two modules collide with each other, considering the specified gutter size.
 *
 * @param {ModuleInterface} module1 - The first module to check for collision.
 * @param {ModuleInterface} module2 - The second module to check for collision.
 * @returns {boolean} True if the modules collide, false otherwise.
 */
export const checkCollision = (
  module1: ModuleInterface,
  module2: ModuleInterface
): boolean => {
  // Get X and Y ranges for both modules, considering GUTTER_SIZE
  const [range1XStart, range1XEnd, range1YStart, range1YEnd] = [
    module1.coord.x,
    module1.coord.x + moduleW2LocalWidth(module1.coord.w) + GUTTER_SIZE,
    module1.coord.y,
    module1.coord.y + module1.coord.h + GUTTER_SIZE,
  ];

  const [range2XStart, range2XEnd, range2YStart, range2YEnd] = [
    module2.coord.x,
    module2.coord.x + moduleW2LocalWidth(module2.coord.w) + GUTTER_SIZE,
    module2.coord.y,
    module2.coord.y + module2.coord.h + GUTTER_SIZE,
  ];

  // Check for overlap in both X and Y directions
  const xOverlap = range1XStart < range2XEnd && range1XEnd > range2XStart;
  const yOverlap = range1YStart < range2YEnd && range1YEnd > range2YStart;

  // Return true if there's overlap in both X and Y directions
  return xOverlap && yOverlap;
};

/**
 * Calculates the left index based on the movement and width of a module.
 * If the calculated index exceeds the number of columns, it wraps around to the beginning.
 *
 * @param {number} movement - The movement of the module.
 * @param {number} width - The width of the module.
 * @returns {number} The calculated left index.
 */
export const calculateLeft = (movement: number, width: number): number => {
  // Calculate the movement index based on the column width
  let movementIndex = Math.round(movement / COLUMN_WIDTH);

  // If the sum of movement index and width exceeds the number of columns, wrap around
  const index =
    movementIndex + width > NUM_COLUMNS ? NUM_COLUMNS - width : movementIndex;

  // Calculate the left index based on the column width and gutter size
  return COLUMN_WIDTH * index + GUTTER_SIZE;
};
