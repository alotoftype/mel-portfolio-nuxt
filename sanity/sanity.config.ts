import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { netlifyTool } from "sanity-plugin-netlify";
import {
  defineDocuments,
  defineLocations,
  presentationTool,
} from "sanity/presentation";
import { schemaTypes } from "./schemas";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "2806by2t";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  "production";
const isLocalStudio = process.env.NODE_ENV !== "production";
const localPreviewUrl =
  process.env.SANITY_STUDIO_LOCAL_PREVIEW_URL || "http://localhost:3000";
const productionPreviewUrl =
  process.env.SANITY_STUDIO_PRODUCTION_PREVIEW_URL ||
  process.env.SANITY_STUDIO_FRONTEND_URL ||
  "https://melshotya.com";
const previewUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  (isLocalStudio ? localPreviewUrl : productionPreviewUrl);
const defaultAllowOrigins = [
  previewUrl,
  localPreviewUrl,
  "http://127.0.0.1:3000",
  productionPreviewUrl,
  "https://melshotya.com",
  "https://www.melshotya.com",
];
const envAllowOrigins = (process.env.SANITY_STUDIO_ALLOW_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const allowOrigins = [...new Set([...defaultAllowOrigins, ...envAllowOrigins])];

export default defineConfig({
  name: "mel-portfolio",
  title: "MelShotya Photography",

  projectId: "2806by2t",
  dataset: "production",

  plugins: [
    media(),
    netlifyTool(),
    presentationTool({
      previewUrl: {
        initial: previewUrl,
        allowOrigins,
        previewMode: {
          enable: "/preview/enable",
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          { route: "/", type: "homePage" },
          { route: "/about", type: "aboutPage" },
          { route: "/contact", type: "contactPage" },
          {
            route: "/portfolio/:slug",
            filter: `_type == "portfolioItem" && slug.current == $slug`,
          },
          {
            route: "/blog/:slug",
            filter: `_type == "blogPost" && slug.current == $slug`,
          },
        ]),
        locations: {
          homePage: defineLocations({
            locations: [{ title: "Home", href: "/" }],
          }),
          aboutPage: defineLocations({
            locations: [{ title: "About", href: "/about" }],
          }),
          contactPage: defineLocations({
            locations: [{ title: "Contact", href: "/contact" }],
          }),
          siteSettings: defineLocations({
            message: "Site settings are used across multiple pages.",
            locations: [
              { title: "Home", href: "/" },
              { title: "About", href: "/about" },
              { title: "Portfolio", href: "/portfolio" },
              { title: "Blog", href: "/blog" },
              { title: "Contact", href: "/contact" },
            ],
          }),
          navigation: defineLocations({
            message: "Navigation appears throughout the site.",
            locations: [
              { title: "Home", href: "/" },
              { title: "About", href: "/about" },
              { title: "Portfolio", href: "/portfolio" },
              { title: "Blog", href: "/blog" },
              { title: "Contact", href: "/contact" },
            ],
          }),
          portfolioItem: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => {
              if (!doc?.slug) return null;

              return {
                locations: [
                  {
                    title: doc.title || "Portfolio item",
                    href: `/portfolio/${doc.slug}`,
                  },
                  { title: "Portfolio", href: "/portfolio" },
                ],
              };
            },
          }),
          blogPost: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => {
              if (!doc?.slug) return null;

              return {
                locations: [
                  {
                    title: doc.title || "Blog post",
                    href: `/blog/${doc.slug}`,
                  },
                  { title: "Blog", href: "/blog" },
                ],
              };
            },
          }),
        },
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton: Home Page
            S.listItem()
              .title("Home Page")
              .id("homePage")
              .child(
                S.document().schemaType("homePage").documentId("homePage"),
              ),

            // Singleton: About Page
            S.listItem()
              .title("About Page")
              .id("aboutPage")
              .child(
                S.document().schemaType("aboutPage").documentId("aboutPage"),
              ),

            // Singleton: Contact Page
            S.listItem()
              .title("Contact Page")
              .id("contactPage")
              .child(
                S.document()
                  .schemaType("contactPage")
                  .documentId("contactPage"),
              ),

            // Singleton: Site Settings
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),

            S.divider(),

            // Collections
            S.documentTypeListItem("portfolioItem").title("Portfolio"),
            S.documentTypeListItem("blogPost").title("Blog Posts"),

            S.divider(),

            // Navigation
            S.documentTypeListItem("navigation").title("Navigation"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
