import { NavigationEditor } from "@/components/admin/navigation-editor";
import { PageTitle } from "@/components/admin/ui";
import { getNavigation } from "@/lib/cms/content";

export const metadata = { title: "Menus" };

export default async function NavigationPage() {
  const navigation = await getNavigation();
  return (
    <>
      <PageTitle
        title="Menus"
        description="Edit the links in the header and footer. Drag links to reorder them, or drag a link into another menu to move it."
      />
      <NavigationEditor initial={navigation} />
    </>
  );
}
