// src/types/static.d.ts

// For CSS imports
declare module "*.css";

// For SVG imports
declare module "*.svg" {
  const content: string;
  export default content;
}
