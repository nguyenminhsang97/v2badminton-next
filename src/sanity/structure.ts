import type { StructureBuilder, StructureResolver } from "sanity/structure";

export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set(["site_settings"]);

function singletonListItem(
  S: StructureBuilder,
  schemaType: string,
  title: string,
) {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(schemaType));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singletonListItem(S, "site_settings", "Site Settings"),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() ?? ""),
      ),
    ]);
