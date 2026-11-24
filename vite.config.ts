import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { build, defineConfig, type Plugin } from "vite";

function optimizeCriticalAssetsPlugin(): Plugin {
  let outDir = "dist";
  let profileAssetFileName = "";
  let isSsrBuild = false;

  return {
    name: "optimize-critical-assets",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      outDir = config.build.outDir || "dist";
      isSsrBuild = Boolean(config.build.ssr);
    },
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

        // Preload LCP Hero image
        if (/^assets\/profile-.*\.webp$/.test(fileName)) {
          profileAssetFileName = fileName;
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
    async closeBundle() {
      if (isSsrBuild) return;

      const rootDir = path.resolve(import.meta.dirname, ".");
      const distHtmlPath = path.resolve(rootDir, outDir, "index.html");
      if (!fs.existsSync(distHtmlPath)) return;

      const ssrTempDir = path.resolve(rootDir, "node_modules/.vite-prerender");

      try {
        await build({
          configFile: false,
          logLevel: "silent",
          mode: "production",
          base: "./",
          plugins: [react()],
          resolve: {
            alias: {
              "@": rootDir,
            },
          },
          define: {
            "process.env.NODE_ENV": '"production"',
          },
          build: {
            ssr: path.resolve(rootDir, "src/entry-prerender.tsx"),
            outDir: ssrTempDir,
            emptyOutDir: true,
            write: true,
            rollupOptions: {
              output: {
                format: "esm",
                entryFileNames: "entry-prerender.mjs",
              },
            },
          },
        });

        const ssrEntryPath = path.resolve(ssrTempDir, "entry-prerender.mjs");
        const { render } = (await import(
          `${pathToFileURL(ssrEntryPath).href}?t=${Date.now()}`
        )) as { render: () => string };

        let appHtml = render().replace(
          /^(?:<link\b[^>]*rel=["']preload["'][^>]*\/?>)+/i,
          "",
        );
        if (profileAssetFileName) {
          appHtml = appHtml.replace(
            /(?:\.\/|\/)?assets\/profile-[^"'\s>]+\.webp/g,
            `./${profileAssetFileName}`,
          );
        }

        const html = fs.readFileSync(distHtmlPath, "utf8");
        const prerenderedHtml = html.replace(
          '<div id="root"></div>',
          `<div id="root">${appHtml}</div>`,
        );
        fs.writeFileSync(distHtmlPath, prerenderedHtml, "utf8");
      } finally {
        fs.rmSync(ssrTempDir, { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    plugins: [react(), tailwindcss(), optimizeCriticalAssetsPlugin()],
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "."),
      },
    },
    ...(command === "build"
      ? {
          define: {
            "process.env.NODE_ENV": '"production"',
          },
        }
      : {}),
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
