# Alex Rudolph — Online CV

Interactive single-page resume served by GitHub Pages at <http://alex.rudolphhome.com/online-cv/>.

## Editing content

**All content lives in one file: [`data.js`](data.js).** Projects, experience, contracts,
certifications, skills, education, interests, and links are all defined on `window.RESUME`.
Nothing else needs to change when adding or editing an entry.

Example — adding a project:

```js
projects: [
  // ...
  {
    title: "My Project",
    link: "https://example.com",
    tagline: "One-line description",
    icon: "fa-shapes"            // a Font Awesome 6 *solid* icon name
  },
],
```

Check the file still parses before pushing — a stray comma or brace blanks the whole page:

```sh
node --check data.js
```

## How it works

- `index.html` loads `data.js`, then the React components (`Sidebar.jsx`, `Main.jsx`, `App.jsx`)
  compiled in the browser by Babel standalone. There is no build step.
- `.nojekyll` tells GitHub Pages to serve the files as-is.
- The "Printer-friendly", "Enhanced", and "Single-page" PDF links use the browser print dialog
  with styles from `print.css`.

## Local preview

Any static file server works:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Credits

Originally forked from [sharu725/online-cv](https://github.com/sharu725/online-cv), a Jekyll port of the
Orbit theme by Xiaoying Riley at [3rd Wave Media](http://themes.3rdwavemedia.com/).
