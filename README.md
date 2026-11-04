# Portfolio site

Static site: `index.html`, `styles.css`, `app.js` (all content lives in the arrays at the top), `map.js` + `map.css` (the interactive career map, embedded in the System map section; click a block to open its low-level design inline).
No build step. To host: push these files to the `Nikhil-Khaneja.github.io` repo and turn on GitHub Pages (main branch, root).
Preview locally: open `index.html` in a browser.

Architecture images (`assets/arch-*.svg`) are the first Mermaid diagram in each project's GitHub README, pre-rendered once with Mermaid 11.4.1 (`tools/render-diagrams.html`, run with headless Chrome `--dump-dom`). Re-render them when a README diagram changes.

System-map diagrams (`assets/lld-*.svg`) are pre-rendered the same way from the `mermaid` fields in `map.js` (`tools/render-lld.html`).
