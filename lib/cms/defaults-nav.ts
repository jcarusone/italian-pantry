export type NavLink = { id?: number; label: string; href: string; newTab: boolean };
export type FooterColumn = {
  id?: number;
  title: string;
  includeCollections: boolean;
  items: NavLink[];
};
export type Navigation = { header: NavLink[]; footer: FooterColumn[] };

const l = (label: string, href: string): NavLink => ({ label, href, newTab: false });

/** Used until menus are saved in the database (and as the seed data). */
export const DEFAULT_NAVIGATION: Navigation = {
  header: [
    l("Shop", "/products"),
    l("Olive oil", "/#olive-oil"),
    l("Our story", "/about"),
    l("Stories", "/stories"),
    l("Contact", "/contact"),
  ],
  footer: [
    { title: "Shop", includeCollections: true, items: [l("All products", "/products")] },
    {
      title: "About",
      includeCollections: false,
      items: [
        l("Our story", "/about"),
        l("The Abruzzo region", "/about#abruzzo"),
        l("Our standards", "/about#standards"),
        l("Stories", "/stories"),
      ],
    },
    {
      title: "Support",
      includeCollections: false,
      items: [
        l("Shipping and FAQ", "/contact#faq"),
        l("Contact us", "/contact"),
        l("Wholesale enquiries", "/contact?topic=wholesale"),
      ],
    },
  ],
};
