import type { Project } from "../types/user";

export const defaultProjectColor = "#8925af";
export const projectColors = [
  "#9c27b0", // purple
  "#3f51b5", // indigo
  "#2196f3", // blue
  "#00bcd4", // cyan
  "#009688", // teal
  "#4caf50", // green
  "#8bc34a", // light green
  "#cddc39", // lime
  "#ffc107", // amber
  "#ff9800", // orange
  "#ff5722", // deep orange
  "#795548", // brown
  "#e91e63", // pink
  "#f44336", // red
  "#673ab7", // deep purple
  "#3ddc84", // mint green
  "#ff6f61", // coral
  "#ffcccb", // light pink
  "#ffd700", // gold
  "#ffa500", // vivid orange
  "#40e0d0", // turquoise
  "#00ced1", // dark turquoise
  "#1e90ff", // dodger blue
  "#4169e1", // royal blue
  "#6495ed", // cornflower blue
  "#7fffd4", // aquamarine
  "#32cd32", // lime green
  "#adff2f", // green yellow
  "#ff1493", // deep pink
  "#ff00ff", // magenta/fuchsia
  "#ba55d3", // medium orchid
  "#da70d6", // orchid
  "#ee82ee", // violet
  "#ff4500", // orange red
  "#dc143c", // crimson
  "#ff69b4", // hot pink
  "#ff8c00", // dark orange
  "#ffb6c1", // light pink
  "#deb887", // burlywood
  "#98fb98", // pale green
  "#00fa9a", // medium spring green
  "#20b2aa", // light sea green
  "#00ff7f", // spring green
  "#7cfc00", // lawn green
  "#66cdaa", // medium aquamarine
  "#4682b4", // steel blue
  "#87cefa", // light sky blue
  "#87ceeb", // sky blue
  "#00ffff", // aqua
  "#9370db", // medium purple
  "#8a2be2", // blue violet
  "#d2691e", // chocolate
  "#ff6347", // tomato
];

export interface ProjectIdWithColor {
  projectId: number;
  color: string;
}
export function getUncoloredProjectsWithNewColors(
  projects: Project[]
): ProjectIdWithColor[] {
  const usedColors = projects
    .map((p) => p.metadata?.color)
    .filter((color): color is string => !!color);

  const availableColors = projectColors.filter(
    (color) => !usedColors.includes(color)
  );

  const updated: ProjectIdWithColor[] = [];
  let colorIndex = 0;

  for (const project of projects) {
    if (!project.metadata?.color) {
      const assignedColor =
        availableColors[colorIndex % availableColors.length];
      updated.push({ projectId: project.id, color: assignedColor });
      colorIndex++;
    }
  }

  return updated;
}
