# anime4000.github.io

Personal site of Anime4000 — ひとは☆もえ, *Anime Programming*. Built with
[Jekyll](https://jekyllrb.com/) and served by GitHub Pages at
<https://me.hitoha.moe/>.

## Editing content

Almost everything on the site is data. Change a YAML file, push, done.

| To change…                              | Edit                     |
|-----------------------------------------|--------------------------|
| Projects (cards, categories, featured)  | `_data/projects.yml`, `_data/categories.yml`, `_data/archive.yml` |
| Programming language ranking            | `_data/languages.yml`    |
| Favourite anime, characters, voices     | `_data/anime.yml`        |
| xPON numbers, firmware, development tracks, NIJIKA family tree, success stories, timeline | `_data/pon.yml` |
| NIJIKA history (eras, screenshots, credits) | `_data/nijika.yml`, `assets/img/nijika/` |
| Regional PON suppliers (from openpon.org) | `_data/suppliers.yml`  |
| Network skills, machines, partners      | `_data/network.yml`, `_data/partners.yml` |
| IFME features, queue steps, mascots, screenshots, timeline | `_data/ifme.yml`, `assets/img/ifme/` |
| IFME search listing (version, download) | `software` in `ifme.html` front matter |
| Communities and social links            | `_data/communities.yml`, `_data/links.yml` |
| Blog posts shown on the home page       | `_data/writing.yml`      |
| Top navigation                          | `_data/nav.yml`          |
| Site title, description, "as of" date   | `_config.yml`            |
| Search and social preview settings      | `_config.yml` (`seo_title`, `social_image`, `person`) |
| A page's search title and description   | `seo_title` and `description` in that page's front matter |

Pages are `index.html`, `pon.html`, `nijika.html`, `ifme.html`, `projects.html`,
`network.html`, `anime.html` and `404.html`. The back story on the network page is written in `network.html`.
Layouts are in `_layouts/`, shared fragments in `_includes/`, and the whole look
is one stylesheet: `assets/css/main.css`.

Star counts and the other figures are a snapshot. When you update them, update
`stats_as_of` in `_config.yml` too. Star counts are also refreshed in the
browser from the public GitHub API.

## Running it locally

GitHub Pages builds the site on every push, so this is optional. To preview
before pushing you need [Ruby](https://rubyinstaller.org/) (with the DevKit on
Windows):

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000/>.

## Files that must keep their URLs

These are plain static files with no front matter. Jekyll copies them through
untouched, so every existing link to them keeps working:

- `adguard.txt` — AdGuard filter list
- `images/` — screenshots referenced from guides elsewhere
- `curecomp/`, `hitoha/`, `lewd4dead/` — older standalone pages
- `google3826fff9a5c8bcdc.html` — Google site verification
- `hitoha.png`, `hitoha-side.png`, `hitoha.ico`, `moetld.png`, `img_bg.png`
