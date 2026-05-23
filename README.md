# dontpastetheai.com / dontquotetheai.com

![](./assets/og-image.png)

> A website you send to that one person who answers every question with eight hundred words of ChatGPT they clearly didn't read.

You know... That one.

> **This is satire.** Nobody is being attacked, nobody is being cancelled, nobody hates AI, have some humor. Use the tools. Just, you know, read them first.

PRs welcome, especially translations. This is a static HTML page, like the aztecs used to do back in the day.

## Two versions

The site comes in two flavors. Pick whichever one fits:

- **Smooth version** (`/`) — friendly, work-safe, nohello.net-ish. Safe to send to a coworker, a manager, or basically anyone you don't want to surprise with feelings.
- **Angry version** (`/angry/`) — the original, but angrier. Send to people who can handle a joke at volume. Not safe for your manager. Probably.

They cross-link to each other (red button on smooth → angry, green button on angry → smooth). Each has its own translations at the same path:

```
/               → smooth EN
/ptbr.html      → smooth PT-BR
/angry/         → angry EN
/angry/ptbr.html → angry PT-BR
```

CSS and assets live at the root (`/styles.css`, `/assets/`). Angry pages reference them with `../`.

The copy button reads `location.hostname` on load and copies whichever domain the visitor landed on (dontpastetheai.com or dontquotetheai.com). The static button text in the HTML is there as a fallback if JS doesn't run.

## How to translate

Each language is one HTML file per version. You need to translate **both** smooth and angry (they're separate with different tones, not one doc).

### The process

1. Pick a language code ([BCP 47 format](https://en.wikipedia.org/wiki/IETF_language_tag)) — `pt-BR` not `pt_BR`, `zh-CN` not `zh_cn`, etc.
2. Copy the files:
   - `index.html` → `<code>.html` (smooth)
   - `angry/index.html` → `angry/<code>.html` (angry)
   So for Spanish: `es.html` and `angry/es.html`.
3. Translate all the visible text. Things that need it:
   - `<title>` and `<meta>` description tags
   - `og:title` and `og:description`
   - `<html lang="...">` attribute
   - Everything visible inside `<header>`, `<section>`, `<blockquote>`, `<ol>`, `.shout`, `.signature`, `.footer`
   - The language `<select>` `aria-label`
   - Button `aria-label` and the "copied!" string in the `<script>` (if you want localized feedback)
   - The cross-link button text (red `.cta-angry` on smooth, green `.cta-calm` on angry)
   - `og:url` and `<link rel="canonical">` to point at your file:
     - smooth: `https://dontpastetheai.com/<code>.html`
     - angry: `https://dontpastetheai.com/angry/<code>.html`
4. Don't touch these:
   - CSS classes, HTML structure, `<script>` logic
   - The `dontpastetheai.com` text in the copy button (JS rewrites it at runtime)
   - Font links, OG image paths (just change the filename suffix)
   - Cross-link `href` (smooth → `angry/<code>.html`, angry → `../<code>.html`)
   - GitHub link, nohello/dontasktoask links, YouTube "mad" link
   - In angry files, the `../styles.css` and `../assets/...` relative paths
5. Add your language `<option>` to the `<select>` in **every** existing HTML file (all smooth, all angry, yours included). Format: `<option value="yourfile.html">XX — Native Name</option>`. Mark your own language as selected in your file.
6. Add `hreflang` links in the `<head>` of **every** existing HTML file, pointing to yours. Smooth links to smooth, angry links to angry:
   ```html
   <!-- in smooth pages -->
   <link rel="alternate" hreflang="xx-XX" href="https://dontpastetheai.com/yourfile.html">
   <!-- in angry pages -->
   <link rel="alternate" hreflang="xx-XX" href="https://dontpastetheai.com/angry/yourfile.html">
   ```
7. Create an OG image (see below).
8. Open a PR.

### OG image (social card)

Each language needs its own card so Twitter/Slack/etc show the right preview.

File pattern: `assets/og-image-<lang>.svg` and `assets/og-image-<lang>.png`. English is just `og-image.svg`/`.png` (no suffix). Portuguese is `og-image-ptbr.svg`/`.png`. Match the suffix to your HTML filename. Same language can use one OG image for both versions, or ship two (`og-image-<lang>.png` and `og-image-<lang>-angry.png`) if you want different previews.

#### Making it

1. Copy `assets/og-image.svg` to `assets/og-image-<lang>.svg`.
2. Open it and find the three `<text>` elements that say "Oops, you pasted / the AI without / reading it." Translate them. Keep the red `<tspan fill="#a82820">` (whatever your word for "AI" is) so the color stays. Try to keep line lengths balanced or the text overflows.
3. Leave the `dontpastetheai.com` in the yellow tag alone (that's the domain).
4. Render to PNG at 1200×630. You need `Special Elite` and `JetBrains Mono` installed locally. Get them from Google Fonts, put the `.ttf` files in `~/.local/share/fonts/`, run `fc-cache -f`, then:

   ```bash
   rsvg-convert -w 1200 -h 630 assets/og-image-<lang>.svg -o assets/og-image-<lang>.png
   ```

   No `rsvg-convert`? Inkscape, ImageMagick, or any SVG→PNG web tool works. Just make sure it's exactly 1200×630.
5. Update `og:image` and `twitter:image` in your HTML to point at your PNG.

Can't render locally? Ship the SVG in the PR and say so, we'll handle it.

#### Non-Latin scripts (Cyrillic, CJK, Arabic, etc.)

`Special Elite` is Latin-only. It won't render Cyrillic, Chinese, Japanese, Korean, Arabic, Hebrew, Thai, or basically anything non-A–Z. You'll get empty boxes or a fallback font.

What to do:

- Pick a monospace display font that matches the vibe (typewriter, slightly rough). Good bets: `Courier Prime` (broad coverage), `IBM Plex Mono` (Latin + Cyrillic + Greek + JP/KR), `Noto Sans Mono` (everything), `JetBrains Mono` (already loaded, decent Cyrillic).
- In your HTML only, swap the Google Fonts `<link>` and update the `--font-type` CSS variable in a `<style>` block in `<head>`. Don't touch `styles.css`.
- In your OG SVG, change `font-family="Special Elite"` to your font. Make sure it's installed before rendering.
- It won't look identical to English, and that's fine. Aim for "same vibe in my script" not "pixel-perfect match".

Not sure? Open a PR with your best guess and we'll iterate.

### Tone notes

The two versions have different tones. Don't merge them, keep them separate.

- **Smooth version**: friendly, work-safe, nohello.net-ish. Direct without being aggressive. Picture sending this to a coworker you respect and don't want to weird out. No swearing, no insults, just a clear ask. Check `ptbr.html` for how PT-BR does it.
- **Angry version**: satire with actual feelings. Frustrated, opinionated, a bit rude on purpose. Don't smooth it into corporate-speak. If your language has real slang for "lazy AI paste behavior", use it. Goal: reader feels called out, not lectured. Look at `angry/ptbr.html` — it's how people actually talk in Portuguese, not textbook stuff.

### Right-to-left languages?

Add `dir="rtl"` to the `<html>` tag. CSS doesn't have logical properties everywhere yet, so layout might look weird. Open the PR anyway, we'll fix it in review.

## Local dev

No build step. Open `index.html` in a browser, or run `python3 -m http.server` from the repo root if you want a local server. Angry pages are at `/angry/index.html` and `/angry/ptbr.html`.

## Deploy

Cloudflare Workers Assets via `wrangler.jsonc`. Pushes to `main` go live automatically. Served at both `dontpastetheai.com` and `dontquotetheai.com`, and the copy button shows whichever domain the visitor is on.

## License

See `LICENSE`. Free to share, remix, translate.
