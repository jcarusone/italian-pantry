import { PageHeader } from "@/components/layout/page-header";
import { PillLink } from "@/components/ui/pill";

export default function NotFound() {
  return (
    <div className="pb-24 md:pb-36">
      <PageHeader
        lines={["This shelf is empty"]}
        intro="The page you're looking for has moved or doesn't exist. The pantry itself is fully stocked."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <PillLink href="/products">Browse the collection</PillLink>
          <PillLink href="/" variant="ghostDark">
            Back to home
          </PillLink>
        </div>
      </PageHeader>
    </div>
  );
}
