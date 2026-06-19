import type { JsonLdNode } from "@/lib/schema";

type JsonLdProps = {
  data: JsonLdNode | ReadonlyArray<JsonLdNode>;
  id?: string;
};

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
