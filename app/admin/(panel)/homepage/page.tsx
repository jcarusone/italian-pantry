import { HomeLayoutEditor } from "@/components/admin/home-layout-editor";
import { PageTitle } from "@/components/admin/ui";
import { getContent } from "@/lib/cms/content";
import { HOME_SECTION_LABELS } from "@/lib/cms/sections";

export const metadata = { title: "Homepage layout" };

export default async function HomepageLayout() {
  const layout = await getContent("home.layout");
  // Include any section added to the site after the layout was last saved.
  const known = new Set(layout.sections.map((s) => s.id));
  const rows = [
    ...layout.sections.filter((s) => s.id in HOME_SECTION_LABELS),
    ...Object.keys(HOME_SECTION_LABELS)
      .filter((id) => !known.has(id))
      .map((id) => ({ id, visible: false })),
  ];

  return (
    <>
      <PageTitle
        title="Homepage layout"
        description="Drag sections to change their order on the homepage, and hide the ones you don't want shown. Products always come from Shopify."
      />
      <HomeLayoutEditor initial={rows} labels={HOME_SECTION_LABELS} />
    </>
  );
}
