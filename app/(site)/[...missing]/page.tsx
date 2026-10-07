import { notFound } from "next/navigation";

/** Sends unknown addresses to the site's own 404 page, inside the site layout. */
export default function CatchAll() {
  notFound();
}
