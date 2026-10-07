import { MediaLibrary } from "@/components/admin/media-library";
import { PageTitle } from "@/components/admin/ui";
import { listMedia } from "@/lib/admin/actions";
import { usesVercelBlob } from "@/lib/storage";

export const metadata = { title: "Images" };

export default async function MediaPage() {
  const items = await listMedia();
  return (
    <>
      <PageTitle
        title="Images"
        description="Every image uploaded to the site. Images you upload here can be chosen in any section or story. Product photos are managed in Shopify."
      />
      <MediaLibrary initial={items} storage={usesVercelBlob() ? "blob" : "local"} />
    </>
  );
}
