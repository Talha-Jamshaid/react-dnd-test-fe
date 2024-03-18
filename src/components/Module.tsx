import React from "react";
import { Box } from "@mui/material";
import { useDrag, useDragDropManager } from "react-dnd";
import { useRafLoop } from "react-use";

import ModuleInterface from "../types/ModuleInterface";
import { checkCollision, calculateLeft, moduleW2LocalWidth } from "../helpers";
import { GUTTER_SIZE } from "../constants";

type ModuleProps = {
  data: ModuleInterface;
  modules: ModuleInterface[];
  updateModulesPositions: (updatedModule: ModuleInterface) => void;
};

const Module = (props: ModuleProps) => {
  const {
    data: {
      id,
      coord: { x, y, w, h },
    },
    modules,
    updateModulesPositions,
  } = props;

  // Transform x, y to left, top
  const [{ top, left }, setPosition] = React.useState(() => ({
    top: y,
    left: x,
  }));

  const dndManager = useDragDropManager();
  const initialPosition = React.useRef<{ top: number; left: number }>();

  /**
   * Handles collision detection and adjustment of the module's position if necessary.
   */
  const handleCollision = (): void => {
    for (const module of modules) {
      // Check if the current module collides with any other module
      if (
        module.id !== id &&
        checkCollision(
          { id, coord: { x: left, y: top, w, h } }, // Current module's position
          module // Other module to check collision against
        )
      ) {
        // Calculate the new top position for the module to avoid collision
        const newTop = module.coord.y + module.coord.h + GUTTER_SIZE;

        // Update the module's position to avoid collision
        setPosition((prevPosition) => ({ ...prevPosition, top: newTop }));

        // Update the positions of both modules after collision adjustment
        updateModulesPositions({ id, coord: { x: left, y: newTop, w, h } });
      }
    }
  };

  // Use request animation frame to process dragging
  const [stop, start] = useRafLoop(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();

    if (!initialPosition.current || !movement) {
      return;
    }

    // Calculate the new top position by adding the vertical movement to the initial top position
    const topMovement = initialPosition.current.top + movement.y;

    // Calculate the new left position by adding the horizontal movement to the initial left position
    const leftMovement = initialPosition.current.left + movement.x;

    // Ensure that the top position stays within the bounds of the container, considering the gutter size
    let top = topMovement < GUTTER_SIZE ? GUTTER_SIZE : topMovement;

    // Ensure that the left position stays within the bounds of the container, considering the gutter size
    let left =
      leftMovement < GUTTER_SIZE
        ? GUTTER_SIZE // If the left position is less than the gutter size, set it to the gutter size
        : calculateLeft(leftMovement, w); // Calculate the new left position considering the width of the module
    // Update new position of the module
    setPosition({
      top: top,
      left: left,
    });

    // Update the positions of module
    updateModulesPositions({ id, coord: { x: left, y: top, w, h } });
  }, false);

  // Wire the module to DnD drag system
  const [, drag] = useDrag(
    () => ({
      type: "module",
      item: () => {
        // Track the initial position at the beginning of the drag operation
        initialPosition.current = { top, left };

        // Start raf
        start();
        return { id };
      },
      end: () => {
        // Drag End
        stop();
        // Invoke the handleCollision function to detect and resolve collisions between the current module and other modules
        handleCollision();
      },
    }),
    [top, left]
  );

  return (
    <Box
      ref={drag}
      display="flex"
      position="absolute"
      border={1}
      borderColor="grey.500"
      padding="10px"
      bgcolor="rgba(0, 0, 0, 0.5)"
      top={top}
      left={left}
      width={moduleW2LocalWidth(w)}
      height={h}
      sx={{
        transitionProperty: "top, left",
        transitionDuration: "0.1s",
        "& .resizer": {
          opacity: 0,
        },
        "&:hover .resizer": {
          opacity: 1,
        },
      }}
    >
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={40}
        color="#fff"
        sx={{ cursor: "move" }}
        draggable
      >
        <Box sx={{ userSelect: "none", pointerEvents: "none" }}>{id}</Box>
      </Box>
    </Box>
  );
};

export default React.memo(Module);
