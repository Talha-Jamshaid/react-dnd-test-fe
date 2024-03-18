import React from "react";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";

import Grid from "./Grid";
import Module from "./Module";
import { GUTTER_SIZE } from "../constants";
import { moduleX2LocalX, moduleY2LocalY } from "../helpers";
import ModuleInterface from "../types/ModuleInterface";

const Page = () => {
  const [modules, setModules] = React.useState([
    {
      id: 1,
      coord: { x: moduleX2LocalX(1), y: moduleY2LocalY(80), w: 2, h: 200 },
    },
    {
      id: 2,
      coord: { x: moduleX2LocalX(5), y: moduleY2LocalY(0), w: 3, h: 100 },
    },
    {
      id: 3,
      coord: { x: moduleX2LocalX(4), y: moduleY2LocalY(310), w: 3, h: 200 },
    },
  ]);

  const updateModulesPositions = (updatedModule: ModuleInterface) => {
    setModules(
      [...modules].map((module) => {
        return module.id === updatedModule.id ? updatedModule : module;
      })
    );
  };

  const containerRef = React.useRef<HTMLDivElement>();

  // Wire the module to DnD drag system
  const [, drop] = useDrop({ accept: "module" });
  drop(containerRef);

  // Calculate container height
  const containerHeight = React.useMemo(
    () =>
      Math.max(...modules.map(({ coord: { y, h } }) => y + h)) +
      GUTTER_SIZE * 2,
    [modules]
  );

  return (
    <Box
      ref={containerRef}
      position="relative"
      width={1024}
      height={containerHeight}
      margin="auto"
      sx={{
        overflow: "hidden",
        outline: "1px dashed #ccc",
        transition: "height 0.2s",
      }}
    >
      <Grid height={containerHeight} />
      {modules.map((module) => (
        <Module
          key={module.id}
          data={module}
          updateModulesPositions={updateModulesPositions}
          modules={modules}
        />
      ))}
    </Box>
  );
};

export default React.memo(Page);
