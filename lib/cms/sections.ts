/**
 * Every editable section of the site: its admin fields and its default copy.
 * Defaults are what the site shows before anything is saved in the database.
 *
 * Text formatting supported in long-text fields:
 *   **bold**, *italic*, and a blank line between paragraphs.
 */
import type { Field, ImageValue, LinkValue, SectionDef } from "./fields";

const img = (url: string, alt: string): ImageValue => ({ url, alt });
const link = (label: string, href: string): LinkValue => ({ label, href });

/* -------------------------------------------------------------------------- */
/*                                  Defaults                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULTS = {
  site: {
    announcement:
      "Free shipping on orders over $75 across Canada. Every product imported directly from Italy.",
    freeShippingThreshold: 75,
    footerBlurb:
      "Authentic Italian food from small-batch artisan producers and family farms in Italy's Abruzzo region, imported directly to your door. Honest, simple, exceptional.",
    established: "2024",
    contactEmail: "orders@italianpantry.com",
    contactPhone: "+1 (416) 949 8641",
    contactLocation: "Toronto, Ontario",
    contactHours: "Monday to Friday, 9am to 6pm ET",
    seoTitle: "Italian Pantry | Authentic Italian food, imported from Italy",
    seoDescription:
      "Authentic Italian food imported from small-batch artisan producers and family farms in Italy's Abruzzo region. Extra virgin olive oil, tomato products, spreads and more. No additives, no fillers, just honest food.",
  },

  "home.hero": {
    eyebrow: "From the Abruzzo coast of Italy to your table",
    heading: "Real Italian food.\nNothing to hide.",
    body: "Authentic ingredients from small-batch artisan producers and family farms along Italy's Adriatic coast. No additives, no fillers, no shortcuts. Just honest food made the way it always has been.",
    primaryCta: link("Shop the collection", "/products"),
    secondaryCta: link("Meet the olive oil", "/#olive-oil"),
    image: img(
      "/product-line/img-22.webp",
      "Frantoio Arrizza olive oil beside Italian tomatoes, passata, bruschetta and olive pâté on a rustic table",
    ),
    facts: [
      { label: "Origin", value: "100% Italian" },
      { label: "Producers", value: "Small batch" },
      { label: "Additives", value: "Zero" },
      { label: "Delivered", value: "Across Canada" },
    ],
  },

  "home.ribbon": {
    items: [
      { text: "100% Italian olives" },
      { text: "Cold extraction" },
      { text: "Never blended with seed oils" },
      { text: "Zero additives or preservatives" },
      { text: "Small-batch producers" },
      { text: "Imported from Abruzzo" },
    ],
  },

  "home.story": {
    heading: "A pantry built on\ntrust, tradition\nand honest food",
    body: [
      "Anyone who grew up in an Italian household knows the feeling: shelves stocked with preserves made from summer's last tomatoes, sausages hung to cure through winter, pantry staples that could carry an entire family through the year. It wasn't just food. It was care, craftsmanship and deep respect for what went on the table.",
      "Today, grocery shelves are lined with industrial products that carry the words **“Product of Italy”** on the label, yet many are packaged in Italy using ingredients grown elsewhere. Health-conscious Canadians want better, but the labels are confusing and truly authentic options are hard to find.",
      "**Italian Pantry was born to change that.** We work directly with small-batch artisan producers and family farms in Italy's Abruzzo region: people who respect the land, follow generations-old traditions and take genuine pride in what they produce. Every product we sell carries one simple promise: real ingredients, real origin, nothing extra.",
    ].join("\n\n"),
    image: img("/olive-tree-2.webp", "A basket of freshly picked olives on a bench in an olive grove"),
    quote:
      "“We don't add anything. We don't take anything away. We simply bring Italy's finest food to your table, as nature and tradition intended.”",
    quoteAttribution: "The Italian Pantry promise",
    values: [
      { title: "Provenance", body: "Every product traced to its farm and region in Italy." },
      { title: "Transparency", body: "Simple ingredient lists with nothing you can't pronounce." },
      { title: "Artisan quality", body: "Small-batch producers, not industrial manufacturers." },
      { title: "Accessibility", body: "Premium without being prohibitive. Honest value." },
    ],
  },

  flagship: {
    name: "Frantoio Arrizza",
    productHandle: "frantoio-arrizza-extra-virgin-olive-oil",
    label: "Our flagship",
    heading: "Frantoio Arrizza\nextra virgin\nolive oil",
    origin: "Abruzzo, on the Adriatic coast. 100% Italian.",
    description:
      "Cold-extracted using a centrifuge mill from olives grown exclusively in Abruzzo. Not blended, not diluted, not processed. Pure oil from crushed Italian olives, as it has always been made.",
    image: img("/brand/flagship-bottle.webp", "A one-litre bottle of Frantoio Arrizza extra virgin olive oil"),
    claims: [
      { text: "100% Italian olives from the Abruzzo region" },
      { text: "Cold extraction mill and centrifuge" },
      { text: "Never blended with seed oils" },
      { text: "Zero additives or preservatives" },
      { text: "Low acidity, premium grade" },
      { text: "High polyphenol content" },
    ],
    fallbackNote: "Available in 500 ml and 1 litre bottles.",
    fallbackCta: link("Shop olive oil", "/products/olive-oil"),
    compareHeading: "Not all olive oil is\nwhat it claims to be",
    compareBody: [
      "Many olive oils sold in Canadian grocery stores, even those labelled “extra virgin” or “imported from Italy”, are blended with cheaper seed oils to stretch supply and maximize profit. Some are processed using heat, which destroys the very compounds that make olive oil valuable.",
      "Frantoio Arrizza is different. It is made by a small family operation in Abruzzo using a traditional cold-press and centrifuge process that preserves every drop of nutritional value. The olives never leave Italy. The oil is never touched again after pressing.",
    ].join("\n\n"),
    highlightsTitle: "Health highlights",
    highlights: [
      { label: "Monounsaturated fat (heart-healthy)", value: "High" },
      { label: "Polyphenols (antioxidants)", value: "High" },
      { label: "Acidity level", value: "Low, ≤ 0.3%" },
      { label: "Seed oil blending", value: "None" },
      { label: "Preservatives and additives", value: "Zero" },
    ],
  },

  "home.collection": {
    heading: "Authentic Italian products,\ncarefully curated",
    description:
      "Every product is sourced from small-batch producers and family farms in Italy. Simple ingredients. Exceptional flavour.",
    action: link("Shop everything", "/products"),
    showComingSoon: true,
    comingSoonTitle: "Pasta is coming soon.",
    comingSoonBody: "The next addition to the pantry.",
  },

  "home.region": {
    eyebrow: "Where our food comes from",
    heading: "Where the Majella mountains\nmeet the Adriatic sea",
    image: img("/olive-tree-1.webp", "Old olive trees with harvest crates in a sunlit grove"),
    lead: "Nestled between the peaks of the Majella and Apennine mountains and the clear waters of the Adriatic, Abruzzo is one of Italy's most pristine and authentic regions. Three national parks protect its land. Its soils, climate and centuries of farming tradition produce food of exceptional character.",
    body: "The Costa dei Trabocchi, the coast of the ancient fishing machines, stretches along Abruzzo's shoreline. Olive groves descend toward the sea and the salt air shapes the flavour of everything grown here. This is where our olive oil is born, where our tomatoes ripen, and where our producers have farmed the same land for generations.",
    stats: [
      { value: "2,912 m", label: "Majella peak" },
      { value: "DOP", label: "Protected origin" },
      { value: "3", label: "National parks" },
      { value: "100%", label: "Italian grown" },
    ],
    features: [
      {
        title: "Pristine terroir",
        body: "Clean mountain air, mineral-rich soils and an ideal Mediterranean microclimate, protected by national park status.",
      },
      {
        title: "Family farms and artisan producers",
        body: "Small-batch operations where farmers know every row and take personal pride in every harvest.",
      },
      {
        title: "Centuries of tradition",
        body: "Cold pressing, sun ripening and natural preservation, passed from generation to generation and unchanged because they don't need to be.",
      },
    ],
  },

  "home.mission": {
    label: "Our mission",
    statement:
      "To make exceptional, authentic Italian food accessible to health-conscious Canadians: products with nothing to hide and everything to offer.",
    body: "We believe you deserve to know exactly what is in your food, where it comes from and who made it. By partnering with family farmers and artisan producers in Italy's Abruzzo region, we bridge the gap between the honest, traditional Italian pantry and the modern Canadian table, without compromise.",
  },

  "home.gallery": {
    heading: "From the pantry\nto the table",
    cta: link("Stock your pantry", "/products"),
    images: [
      { image: img("/product-line/img-9.webp", "Tomato sauce simmering in a pan with passata and olive oil nearby") },
      { image: img("/product-line/img-11.webp", "A pantry stocked with olive oil, passata and preserves") },
      { image: img("/product-line/img-15.webp", "Spaghetti being plated beside olive oil, passata and preserves") },
      { image: img("/product-line/img-4.webp", "An antipasto board with olives, bruschetta and olive oil") },
      { image: img("/olive-tree-2.webp", "Freshly picked olives in a basket in the grove") },
      { image: img("/product-line/img-1.webp", "Olive oil being poured over a salad on a set table") },
    ],
  },

  "home.why": {
    heading: "The difference\nyou can taste",
    reasons: [
      {
        title: "True Italian origin",
        body: "Not just packaged in Italy: grown, produced and bottled in Italy. We work only with producers whose products meet the highest standard of authentic Italian origin, from seed to shelf.",
      },
      {
        title: "Simple ingredients only",
        body: "Every product passes our ingredient test: if you can't understand what's in it, it doesn't make our list. No fillers, thickeners, multiple forms of sugar or unnecessary additives. Ever.",
      },
      {
        title: "Artisan, not industrial",
        body: "Mass production prioritizes margins. Our producers prioritize flavour. Small batches, seasonal harvests and family recipes: the kind of care that can't exist at industrial scale.",
      },
      {
        title: "Trusted by health-conscious families",
        body: "Chronic disease is touching too many families. More Canadians are reading labels and demanding better. Italian Pantry is here for them, with quality food that supports a healthier life.",
      },
      {
        title: "Direct from producer to you",
        body: "Working directly with farms and artisan producers removes unnecessary middlemen, bringing you better quality at a fairer price than comparable health food store offerings.",
      },
      {
        title: "A living Italian tradition",
        body: "The same foods Italian families have made for generations. The pantry your grandparents kept, reborn for people who value quality but don't always have time to make it from scratch.",
      },
    ],
  },

  "home.labelGuide": {
    heading: "Not all “Product of\nItaly” labels are equal",
    body: [
      "Under current Canadian and EU regulations, food can be labelled *“Product of Italy”* if the final processing or packaging took place in Italy, even if the raw ingredients were grown elsewhere. This is legal, but it is not what most people expect when they see that label.",
      "At Italian Pantry, **Italian-grown means Italian-grown.** Our tomatoes come from Italian soil. Our olive oil is pressed in Abruzzo from olives grown in Abruzzo. We tell you where every ingredient comes from, because you deserve to know.",
    ].join("\n\n"),
    columnCriteria: "What to look for",
    columnOurs: "Italian Pantry",
    columnTheirs: "Typical industrial",
    rows: [
      { label: "Ingredients grown in Italy", ours: "Yes", theirs: "Often no" },
      { label: "No seed oil blending", ours: "None", theirs: "Common" },
      { label: "Zero additives or preservatives", ours: "Zero", theirs: "Frequently added" },
      { label: "Small-batch production", ours: "Always", theirs: "Industrial scale" },
      { label: "Named producer or farm", ours: "Disclosed", theirs: "Anonymous supply" },
      { label: "Simple ingredient list", ours: "Always simple", theirs: "Multiple additives" },
    ],
  },

  "home.layout": {
    sections: [
      { id: "hero", visible: true },
      { id: "ribbon", visible: true },
      { id: "story", visible: true },
      { id: "flagship", visible: true },
      { id: "collection", visible: true },
      { id: "region", visible: true },
      { id: "mission", visible: true },
      { id: "gallery", visible: true },
      { id: "why", visible: true },
      { id: "labelGuide", visible: true },
      { id: "stories", visible: false },
    ],
  },

  about: {
    heroHeading: "Our story",
    heroBody:
      "We work directly with small-batch artisan producers and family farms in Italy's Abruzzo region. Every product carries one simple promise: real ingredients, real origin, nothing extra.",
    heroImage: img("/product-line/img-13.webp", "Shelves stocked with Italian olive oil, preserves and passata"),
    closingHeading: "Taste the difference\nfor yourself",
    closingPrimary: link("Shop Frantoio Arrizza", "/products/frantoio-arrizza-extra-virgin-olive-oil"),
    closingSecondary: link("Contact us", "/contact"),
  },

  contact: {
    heading: "Get in touch",
    intro:
      "Questions about an order, our products or wholesale? Send us a message and a member of our team will reply.",
    successMessage: "We've received your message and will be in touch.",
    faqHeading: "Questions\nand answers",
    faqs: [
      {
        question: "Where do your products come from?",
        answer:
          "From small-batch artisan producers and family farms in Italy, with a focus on the Abruzzo region on the Adriatic coast. Every product is traced to its farm and region in Italy, and we import directly to Canada.",
      },
      {
        question: "What makes Frantoio Arrizza olive oil different?",
        answer:
          "It is cold-extracted with a centrifuge mill from olives grown exclusively in Abruzzo. It is never blended with seed oils, has no additives or preservatives, and is never processed with heat. The olives never leave Italy, and the oil is not touched again after pressing.",
      },
      {
        question: "Isn't “Product of Italy” on a label enough?",
        answer:
          "Not always. Under current Canadian and EU regulations, food can be labelled “Product of Italy” if the final processing or packaging happened in Italy, even when the raw ingredients were grown elsewhere. Our products are grown and produced in Italy, and we tell you where every ingredient comes from.",
      },
      {
        question: "Do you ship across Canada?",
        answer:
          "Yes. Shipping is free on orders over $75, and the cost for smaller orders is calculated at checkout.",
      },
      { question: "Do you sell pasta?", answer: "Pasta is coming soon. It will be the next addition to the pantry." },
      {
        question: "Do you work with restaurants and retailers?",
        answer:
          "Send us a message using the form above and choose “Wholesale enquiry” as the topic. We'll get back to you with the details.",
      },
    ],
  },

  "shop.page": {
    heading: "The collection",
    intro:
      "Every product is sourced from small-batch producers and family farms in Italy. Simple ingredients. Exceptional flavour.",
    promises: [
      { title: "Real Italian origin", body: "Grown and produced in Italy, not just packaged there." },
      { title: "Nothing extra", body: "No fillers, no preservatives, no unnecessary additives." },
      { title: "Shipped across Canada", body: "Free shipping on orders over $75." },
    ],
  },

  "stories.page": {
    heading: "Stories",
    intro: "Notes on Italian food, the Abruzzo region, and how to read a label with confidence.",
    emptyMessage: "The first stories are on their way.",
    homeHeading: "From our stories",
  },
};

export type Defaults = typeof DEFAULTS;
export type SectionKey = keyof Defaults;
export type SectionContent<K extends SectionKey> = Defaults[K];

/* -------------------------------------------------------------------------- */
/*                              Admin definitions                             */
/* -------------------------------------------------------------------------- */

const t = (name: string, label: string, help?: string): Field => ({ type: "text", name, label, help });
const ta = (name: string, label: string, help?: string, rows = 4): Field => ({
  type: "textarea",
  name,
  label,
  help,
  rows,
});
const heading = (name = "heading", label = "Heading"): Field => ({
  type: "lines",
  name,
  label,
  help: "Each line of text becomes one line of the heading.",
});
const PARAGRAPHS = "Leave a blank line between paragraphs. Use **double asterisks** for bold and *single* for italic.";

const textItem: Field[] = [t("text", "Text")];
const titleBody: Field[] = [t("title", "Title"), ta("body", "Text", undefined, 3)];
const labelValue: Field[] = [t("label", "Label"), t("value", "Value")];

export const SECTIONS: SectionDef[] = [
  {
    key: "site",
    title: "Site settings",
    group: "Site-wide",
    description: "Announcement bar, contact details, footer text and search-engine description.",
    preview: "/",
    fields: [
      t("announcement", "Announcement bar"),
      { type: "number", name: "freeShippingThreshold", label: "Free shipping threshold ($)", help: "Used in the cart's progress bar." },
      ta("footerBlurb", "Footer description", undefined, 3),
      t("established", "Year established"),
      t("contactEmail", "Email"),
      t("contactPhone", "Telephone"),
      t("contactLocation", "Location"),
      t("contactHours", "Opening hours"),
      t("seoTitle", "Search result title"),
      ta("seoDescription", "Search result description", "Around 150 characters works best.", 3),
    ],
  },
  {
    key: "home.hero",
    title: "Hero",
    group: "Homepage",
    description: "The first screen: headline, introduction, buttons and the four facts.",
    preview: "/",
    fields: [
      t("eyebrow", "Small line above the headline"),
      heading("heading", "Headline"),
      ta("body", "Introduction", undefined, 3),
      { type: "link", name: "primaryCta", label: "Main button" },
      { type: "link", name: "secondaryCta", label: "Second button" },
      { type: "image", name: "image", label: "Background image", help: "Wide photo; keep the left side dark and quiet so the headline stays readable." },
      { type: "list", name: "facts", label: "Facts", itemLabel: "fact", titleField: "label", fields: labelValue },
    ],
  },
  {
    key: "home.ribbon",
    title: "Moving ribbon",
    group: "Homepage",
    description: "The phrases that scroll across the band under the hero.",
    preview: "/",
    fields: [{ type: "list", name: "items", label: "Phrases", itemLabel: "phrase", titleField: "text", fields: textItem }],
  },
  {
    key: "home.story",
    title: "Our story",
    group: "Homepage",
    description: "Story text and photo, the promise quote, and the four values. Also used on the About page.",
    preview: "/#our-story",
    fields: [
      heading(),
      ta("body", "Story", PARAGRAPHS, 10),
      { type: "image", name: "image", label: "Photo" },
      ta("quote", "Promise quote", undefined, 3),
      t("quoteAttribution", "Quote attribution"),
      { type: "list", name: "values", label: "Values", itemLabel: "value", titleField: "title", fields: titleBody },
    ],
  },
  {
    key: "flagship",
    title: "Olive oil feature",
    group: "Homepage",
    description: "The flagship olive oil section. The price and sizes come from Shopify.",
    preview: "/#olive-oil",
    fields: [
      t("name", "Oil name"),
      t("productHandle", "Shopify product handle", "The product's handle in Shopify, used for the price and add-to-cart."),
      t("label", "Small label"),
      heading(),
      t("origin", "Origin line"),
      ta("description", "Description", undefined, 3),
      { type: "image", name: "image", label: "Bottle image", help: "A tall photo of the bottle works best." },
      { type: "list", name: "claims", label: "Key points", itemLabel: "point", titleField: "text", fields: textItem },
      t("fallbackNote", "Note shown if the product can't be loaded"),
      { type: "link", name: "fallbackCta", label: "Button shown if the product can't be loaded" },
      heading("compareHeading", "Comparison heading"),
      ta("compareBody", "Comparison text", PARAGRAPHS, 8),
      t("highlightsTitle", "Highlights title"),
      { type: "list", name: "highlights", label: "Highlights", itemLabel: "highlight", titleField: "label", fields: labelValue },
    ],
  },
  {
    key: "home.collection",
    title: "Product collection",
    group: "Homepage",
    description: "Heading above the product grid. The products themselves come from Shopify.",
    preview: "/#collection",
    fields: [
      heading(),
      ta("description", "Description", undefined, 2),
      { type: "link", name: "action", label: "Link beside the heading" },
      { type: "boolean", name: "showComingSoon", label: "Show the “coming soon” tile" },
      t("comingSoonTitle", "Coming soon title"),
      t("comingSoonBody", "Coming soon text"),
    ],
  },
  {
    key: "home.region",
    title: "Abruzzo region",
    group: "Homepage",
    description: "Photo band, region text, figures and the three features. Also used on the About page.",
    preview: "/#abruzzo",
    fields: [
      t("eyebrow", "Small label"),
      heading(),
      { type: "image", name: "image", label: "Photo band" },
      ta("lead", "Opening paragraph", undefined, 4),
      ta("body", "Second paragraph", undefined, 4),
      {
        type: "list",
        name: "stats",
        label: "Figures",
        help: "Numbers count up on screen (e.g. “2,912 m” or “100%”).",
        itemLabel: "figure",
        titleField: "label",
        fields: [t("value", "Figure"), t("label", "Label")],
      },
      { type: "list", name: "features", label: "Features", itemLabel: "feature", titleField: "title", fields: titleBody },
    ],
  },
  {
    key: "home.mission",
    title: "Mission",
    group: "Homepage",
    description: "The mission statement band.",
    preview: "/",
    fields: [t("label", "Small label"), ta("statement", "Statement", undefined, 3), ta("body", "Text", undefined, 4)],
  },
  {
    key: "home.gallery",
    title: "Photo gallery",
    group: "Homepage",
    description: "The row of photos that moves sideways as visitors scroll.",
    preview: "/",
    fields: [
      heading(),
      { type: "link", name: "cta", label: "Button" },
      {
        type: "list",
        name: "images",
        label: "Photos",
        itemLabel: "photo",
        titleField: "image",
        fields: [{ type: "image", name: "image", label: "Photo" }],
      },
    ],
  },
  {
    key: "home.why",
    title: "Why Italian Pantry",
    group: "Homepage",
    description: "The six reasons. Also used on the About page.",
    preview: "/#standards",
    fields: [
      heading(),
      { type: "list", name: "reasons", label: "Reasons", itemLabel: "reason", titleField: "title", fields: titleBody },
    ],
  },
  {
    key: "home.labelGuide",
    title: "Label guide",
    group: "Homepage",
    description: "The “Product of Italy” explainer and comparison table.",
    preview: "/",
    fields: [
      heading(),
      ta("body", "Text", PARAGRAPHS, 8),
      t("columnCriteria", "First column title"),
      t("columnOurs", "Our column title"),
      t("columnTheirs", "Comparison column title"),
      {
        type: "list",
        name: "rows",
        label: "Rows",
        itemLabel: "row",
        titleField: "label",
        fields: [t("label", "What to look for"), t("ours", "Italian Pantry"), t("theirs", "Typical industrial")],
      },
    ],
  },
  {
    key: "about",
    title: "About page",
    group: "Pages",
    description: "The About page's opening and closing. Its middle sections reuse the homepage story, region and reasons.",
    preview: "/about",
    fields: [
      t("heroHeading", "Heading"),
      ta("heroBody", "Introduction", undefined, 3),
      { type: "image", name: "heroImage", label: "Opening image" },
      heading("closingHeading", "Closing heading"),
      { type: "link", name: "closingPrimary", label: "Closing main button" },
      { type: "link", name: "closingSecondary", label: "Closing second button" },
    ],
  },
  {
    key: "contact",
    title: "Contact page and FAQ",
    group: "Pages",
    description: "Contact page text and the questions and answers. Contact details are in Site settings.",
    preview: "/contact",
    fields: [
      t("heading", "Heading"),
      ta("intro", "Introduction", undefined, 3),
      t("successMessage", "Message after sending the form"),
      heading("faqHeading", "Questions heading"),
      {
        type: "list",
        name: "faqs",
        label: "Questions",
        itemLabel: "question",
        titleField: "question",
        fields: [t("question", "Question"), ta("answer", "Answer", undefined, 4)],
      },
    ],
  },
  {
    key: "shop.page",
    title: "Shop and product pages",
    group: "Pages",
    description: "Shop page heading, and the three promises shown on every product page.",
    preview: "/products",
    fields: [
      t("heading", "Shop heading"),
      ta("intro", "Shop introduction", undefined, 2),
      { type: "list", name: "promises", label: "Product page promises", itemLabel: "promise", titleField: "title", fields: titleBody },
    ],
  },
  {
    key: "stories.page",
    title: "Stories page",
    group: "Pages",
    description: "Text around the list of stories. Write and edit stories under Stories.",
    preview: "/stories",
    fields: [
      t("heading", "Heading"),
      ta("intro", "Introduction", undefined, 2),
      t("emptyMessage", "Message when there are no stories"),
      t("homeHeading", "Heading for stories on the homepage"),
    ],
  },
];

export const HOME_SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  ribbon: "Moving ribbon",
  story: "Our story",
  flagship: "Olive oil feature",
  collection: "Product collection",
  region: "Abruzzo region",
  mission: "Mission",
  gallery: "Photo gallery",
  why: "Why Italian Pantry",
  labelGuide: "Label guide",
  stories: "Latest stories",
};

export function getSectionDef(key: string) {
  return SECTIONS.find((s) => s.key === key);
}
