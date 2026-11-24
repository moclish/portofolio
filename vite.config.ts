import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type Plugin } from "vite";

function optimizeCriticalAssetsPlugin(): Plugin {
  return {
    name: "optimize-critical-assets",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;

      let result = html;
      const preloadTags: string[] = [];

      for (const [fileName, asset] of Object.entries(ctx.bundle)) {
        // Inline main entry stylesheet to eliminate render-blocking CSS request
        if (
          asset.type === "asset" &&
          /^assets\/index-.*\.css$/.test(fileName) &&
          typeof asset.source === "string"
        ) {
          const cssInlined = asset.source.replace(
            /url\(\.\/(plus-jakarta-sans-[^)]+)\)/g,
            "url(./assets/$1)",
          );
          const linkRegex = new RegExp(
            `<link[^>]+href=["']\\.?\\/${fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`,
          );
          if (linkRegex.test(result)) {
            result = result.replace(linkRegex, `<style>${cssInlined}</style>`);
            delete ctx.bundle[fileName];
          }
        }

        // Preload LCP Hero image (discovered otherwise only after React executes)
        if (/^assets\/profile-.*\.webp$/.test(fileName)) {
          preloadTags.push(
            `<link rel="preload" as="image" type="image/webp" fetchpriority="high" href="./${fileName}" />`,
          );
        }

        // Preload primary Latin variable font to avoid FOUT / font-swap chain delay
        if (/^assets\/plus-jakarta-sans-latin-wght-normal-.*\.woff2$/.test(fileName)) {
          preloadTags.push(
            `<link rel="preload" as="font" type="font/woff2" crossorigin href="./${fileName}" />`,
          );
        }
      }

      if (preloadTags.length > 0) {
        result = result.replace("</head>", `  ${preloadTags.join("\n  ")}\n  </head>`);
      }

      return result;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), optimizeCriticalAssetsPlugin()],
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "."),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
