// sanity.cli.ts
import { defineCliConfig } from "sanity/cli";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "2806by2t";

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: "cia4q42o9tl8x6iuueozzya4",
  },
});
