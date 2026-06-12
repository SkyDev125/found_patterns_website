# Ren's Portfolio & Commission Website

A dynamic, artistic portfolio website for the illustrator and character artist Ren. Built from scratch using Svelte 5, Bun, Tailwind CSS v4, and pre-rendered as a static website for deployment to GitHub Pages.

This site merges Ren's main gallery/rates Carrd (`ren-patterns.carrd.co`) and rules/terms Carrd (`renniefication.carrd.co`) into a single, cohesive, premium web experience.

## ✨ Key Features
- **Dynamic Tabs**: Seamless, animated transitions between Home Hub, Gallery & Pricing, Custom Price Calculator, and Terms & Rules.
- **Interactive Particle Background**: Custom canvas-based glowing floating sparkles that flow upwards behind the glassmorphic cards.
- **High-Resolution Lightbox**: Beautiful click-to-zoom modal with cycling support to browse original illustrations without leaving the page.
- **Interactive Price Calculator**: Interactive widget that lets potential clients build and estimate commission costs (e.g. Headshot, Half-body, Full-body, Stickers, Emotes, complexity settings, extra characters, background options) in real-time.
- **Accessible & SEO optimized**: Clean heading structure, descriptive title/meta description tags, and keyboard-navigable interactive controls.

## 🛠️ Local Development

### 1. Install Dependencies
Ensure you have [Bun](https://bun.sh) installed, then run:
```bash
bun install
```

### 2. Run Development Server
Start the local server at `http://localhost:5173`:
```bash
bun run dev
```

### 3. Build Static Site
Compile and pre-render the static website into the `build/` directory:
```bash
bun run build
```

You can preview the compiled static build locally using:
```bash
bun run preview
```

## 🚀 GitHub Pages Deployment
The project is configured to deploy automatically via GitHub Actions in `.github/workflows/deploy.yml` on every push to the `main` branch.

> [!IMPORTANT]
> **Enable GitHub Actions for Pages**:
> By default, GitHub Pages may be configured to deploy from a branch. Since this project uses an automated Actions deployment workflow, you must enable it in the repository settings:
> 1. Go to your repository settings page: [GitHub Pages Settings](https://github.com/SkyDev125/found_patterns_website/settings/pages)
> 2. Under **Build and deployment** -> **Source**, select **GitHub Actions** from the dropdown menu instead of "Deploy from a branch".
> 3. Once updated, re-run the failed GitHub Actions run or push a new commit to trigger a successful deployment.

### Base Path Configuration
Because this site is hosted as a project page under a subdirectory (`/found_patterns_website`), SvelteKit is configured to dynamically resolve asset URLs using the `BASE_PATH` environment variable.
- In **development**, the base path is empty (`""`).
- In **production build**, the GitHub Actions workflow injects `BASE_PATH: '/found_patterns_website'` so all script imports and image paths resolve correctly on GitHub Pages.
- When referencing static assets in code, always import `base` and prefix paths:
  ```svelte
  <script>
    import { base } from '$app/paths';
  </script>
  <img src="{base}/assets/image01.png" alt="Artwork" />
  ```

