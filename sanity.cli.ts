import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity environment variables. Expected NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
