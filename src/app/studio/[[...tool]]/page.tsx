import { NextStudio } from "next-sanity/studio";
import config, { isSanityStudioConfigured } from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityStudioConfigured) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Sanity Studio is unavailable</h1>
        <p>
          Missing <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> or{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>.
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
