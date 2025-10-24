import { useMutation } from "@tanstack/react-query";

import type { ProjectIdWithColor } from "../../utils/projectColorConfigs";
import { updateProjectWithColor } from "../../services/api";

export const useUpdateProjectColors = () => {
  return useMutation({
    mutationFn: ({
      projctWithColors,
    }: {
      projctWithColors: ProjectIdWithColor[];
    }) => updateProjectWithColor(projctWithColors),
  });
};
