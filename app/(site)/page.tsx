import { Collection } from "@/components/home/collection";
import { Flagship } from "@/components/home/flagship";
import { Gallery } from "@/components/home/gallery";
import { Hero } from "@/components/home/hero";
import { LabelGuide } from "@/components/home/label-guide";
import { LatestStories } from "@/components/home/latest-stories";
import { Mission } from "@/components/home/mission";
import { Region } from "@/components/home/region";
import { Ribbon } from "@/components/home/ribbon";
import { Story } from "@/components/home/story";
import { Why } from "@/components/home/why";
import { getContent, getPublishedStories } from "@/lib/cms/content";
import { getProduct, getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

export const revalidate = 300;

async function safely<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("Homepage data unavailable:", error);
    return fallback;
  }
}

export default async function HomePage() {
  const [layout, flagshipContent] = await Promise.all([getContent("home.layout"), getContent("flagship")]);
  const visible = layout.sections.filter((s) => s.visible).map((s) => s.id);
  const shows = (id: string) => visible.includes(id);

  const [
    hero, ribbon, story, collection, region, mission, gallery, why, labelGuide, storiesPage,
    products, flagship, stories,
  ] = await Promise.all([
    getContent("home.hero"),
    getContent("home.ribbon"),
    getContent("home.story"),
    getContent("home.collection"),
    getContent("home.region"),
    getContent("home.mission"),
    getContent("home.gallery"),
    getContent("home.why"),
    getContent("home.labelGuide"),
    getContent("stories.page"),
    shows("collection") ? safely<Product[]>(getProducts({ first: 12, sortKey: "BEST_SELLING" }), []) : [],
    shows("flagship") && flagshipContent.productHandle
      ? safely<Product | null>(getProduct(flagshipContent.productHandle), null)
      : null,
    shows("stories") ? getPublishedStories(3) : [],
  ]);

  const render: Record<string, React.ReactNode> = {
    hero: <Hero content={hero} underHeader={visible[0] === "hero"} />,
    ribbon: <Ribbon items={ribbon.items.map((item) => item.text).filter(Boolean)} />,
    story: <Story content={story} />,
    flagship: <Flagship product={flagship} content={flagshipContent} />,
    collection: <Collection products={products} content={collection} />,
    region: <Region content={region} />,
    mission: <Mission content={mission} />,
    gallery: <Gallery content={gallery} />,
    why: <Why content={why} />,
    labelGuide: <LabelGuide content={labelGuide} />,
    stories: <LatestStories heading={storiesPage.homeHeading} stories={stories} />,
  };

  return (
    <>
      {visible.map((id) => (
        <div key={id} className="contents">
          {render[id] ?? null}
        </div>
      ))}
    </>
  );
}
