/* App.jsx — top bar, theme toggle, command palette, root */
const { useState: useS, useEffect: useE, useMemo: useM, useRef: useR } = React;

function useTheme() {
  const [theme, setTheme] = useS(() => localStorage.getItem("orbit-theme") || "light");
  useE(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit-theme", theme);
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "light" ? "dark" : "light"))];
}

function TopBar({ theme, toggleTheme, openCmd, d }) {
  return (
    <div className="topbar">
      <button className="tb-btn" onClick={openCmd} title="Search (⌘K)">
        <i className="fas fa-magnifying-glass"></i> Jump to… <kbd>⌘K</kbd>
      </button>
      <button className="tb-btn icon" onClick={toggleTheme} title="Toggle theme">
        <i className={theme === "light" ? "fas fa-moon" : "fas fa-sun"}></i>
      </button>
    </div>
  );
}

function CommandPalette({ d, onClose, toggleTheme }) {
  const [q, setQ] = useS("");
  const [active, setActive] = useS(0);
  const inputRef = useR(null);

  const commands = useM(() => {
    const nav = [
      { group: "Navigate", icon: "fa-user", label: "Career Profile", sub: "about", run: () => scrollTo("about") },
      { group: "Navigate", icon: "fa-briefcase", label: "Experience", sub: "experience", run: () => scrollTo("experience") },
      { group: "Navigate", icon: "fa-folder-open", label: "Projects", sub: "projects", run: () => scrollTo("projects") },
      { group: "Navigate", icon: "fa-file-signature", label: "Contracts", sub: "contracts", run: () => scrollTo("contracts") },
      { group: "Navigate", icon: "fa-certificate", label: "Certifications", sub: "certifications", run: () => scrollTo("certifications") },
      { group: "Navigate", icon: "fa-chart-simple", label: "Skills & Proficiency", sub: "skills", run: () => scrollTo("skills") },
    ];
    const actions = [
      { group: "Actions", icon: "fa-circle-half-stroke", label: "Toggle dark / light theme", sub: "theme", run: () => { toggleTheme(); } },
      { group: "Actions", icon: "fa-print", label: "Printer-friendly PDF (ink-saver)", sub: "print", run: () => { onClose(); setTimeout(() => window.printResume("ink"), 60); } },
      { group: "Actions", icon: "fa-file-lines", label: "Enhanced PDF (full color + links)", sub: "⌘P", run: () => { onClose(); setTimeout(() => window.printResume("full"), 60); } },
      { group: "Actions", icon: "fa-file-export", label: "Single-page PDF (one tall page)", sub: "single", run: () => { onClose(); setTimeout(() => window.printResume("single"), 60); } },
    ];
    const links = [
      { group: "Links", icon: "fa-brands fa-linkedin", label: "LinkedIn", sub: "alexrudolph", run: () => open(d.links.linkedin) },
      { group: "Links", icon: "fa-brands fa-github", label: "GitHub", sub: "Xander-Rudolph", run: () => open(d.links.github) },
      { group: "Links", icon: "fa-brands fa-stack-overflow", label: "Stack Overflow", sub: "xanderu", run: () => open(d.links.stackoverflow) },
      { group: "Links", icon: "fa-globe-americas", label: "Website", sub: d.links.websiteLabel, run: () => open(d.links.website) },
    ];
    const projects = d.projects.map((p) => ({
      group: "Projects", icon: "fa-arrow-up-right-from-square", label: p.title, sub: "open", run: () => open(p.link),
    }));
    return [...nav, ...actions, ...links, ...projects];
  }, [d]);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
    onClose();
  }
  function open(url) { window.open(url, "_blank", "noopener"); onClose(); }

  const filtered = useM(
    () => commands.filter((c) => (c.label + " " + c.group).toLowerCase().includes(q.toLowerCase())),
    [q, commands]
  );

  useE(() => { inputRef.current && inputRef.current.focus(); }, []);
  useE(() => { setActive(0); }, [q]);

  function onKey(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); filtered[active] && filtered[active].run(); }
    else if (e.key === "Escape") { onClose(); }
  }

  let lastGroup = null;
  return (
    <div className="cmdk-backdrop" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <i className="fas fa-magnifying-glass"></i>
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a section, action, or link…"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
          />
          <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>ESC</kbd>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && (
            <div className="cmdk-item"><span className="lab" style={{ color: "var(--fg-subtle)" }}>No matches</span></div>
          )}
          {filtered.map((c, i) => {
            const header = c.group !== lastGroup ? <div className="cmdk-group" key={"g" + i}>{c.group}</div> : null;
            lastGroup = c.group;
            return (
              <React.Fragment key={i}>
                {header}
                <div
                  className={"cmdk-item" + (i === active ? " active" : "")}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => c.run()}
                >
                  <span className="ic"><i className={c.icon.startsWith("fa-brands") ? c.icon : "fas " + c.icon}></i></span>
                  <span className="lab">{c.label}</span>
                  <span className="sub">{c.sub}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KitFooter({ d }) {
  return (
    <footer className="kit-footer">
      <span>Contact me via <a href={d.links.linkedin} target="_blank" rel="noopener">LinkedIn</a></span>
      <span>Built with <i className="fas fa-heart"></i> on the modernized <a href="https://github.com/sharu725/online-cv" target="_blank" rel="noopener">Orbit</a> theme</span>
    </footer>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "skillStyle": "Bars",
  "skillFill": "Oxide",
  "skillSort": "Level",
  "skillCols": "2",
  "showPercent": true
}/*EDITMODE-END*/;

function App() {
  const d = window.RESUME;
  const [theme, toggleTheme] = useTheme();
  const [cmdOpen, setCmdOpen] = useS(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useE(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((o) => !o); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") { e.preventDefault(); window.printResume("full"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // PDF / print engine: 'ink' = printer-friendly B&W-leaning, 'full' = Enhanced full-color,
  // 'single' = one tall page (8.5in wide, auto height).
  useE(() => {
    window.printResume = (mode) => {
      const m = mode || "full";
      document.documentElement.setAttribute("data-print", m);
      // hide PDF sidebar links — useless in any printed/exported document
      document.querySelectorAll(".contact-list li.pdf").forEach((el) => {
        el.style.setProperty("display", "none", "important");
      });
      // fill skill bars / rings in case the user hasn't scrolled them into view yet
      document.querySelectorAll(".sk-fill").forEach((f) => {
        if (f.dataset.level) f.style.width = f.dataset.level + "%";
      });
      document.querySelectorAll(".ring").forEach((r) => {
        if (r.dataset.level) r.style.setProperty("--p", r.dataset.level);
      });
      // single-page mode: data-print="single" (set above) applies the full print layout
      // on-screen via print.css selectors, so scrollHeight here reflects the true print
      // height. Measure after two rAFs (layout settle), inject a matching @page, then print.
      let styleTag = null;
      if (m === "single") {
        // Constrain the shell to the actual print content width (8.5in - 2×10mm margins ≈ 740px)
        // so text reflows the same way it will when printed, then measure the footer's bottom.
        // Constrain to print width so text reflows identically to print layout.
        // Must use setProperty('important') because the CSS has max-width: 100% !important.
        const shell = document.querySelector(".resume-shell");
        if (shell) shell.style.setProperty("max-width", "740px", "important");

        requestAnimationFrame(() => requestAnimationFrame(() => {
          const footer = document.querySelector(".kit-footer");
          const contentBottom = footer
            ? footer.getBoundingClientRect().bottom + window.scrollY
            : document.documentElement.scrollHeight;
          // Chrome scales content from bodyWidth → 8.5in page width.
          // Scale factor ≈ 816 / body.scrollWidth, so actual printed height
          // is contentBottom * scale. Using 6in buffer reliably covers the
          // scale-adjusted height. Bare @page (no @media wrapper) is required —
          // @media print wrapper conflicts with print.css's own @page rule.
          const scale = 816 / (document.body.scrollWidth || 816);
          const printedH = contentBottom * scale / 96; // in inches
          const heightIn = (printedH + 6).toFixed(2);

          if (shell) shell.style.removeProperty("max-width");

          styleTag = document.createElement("style");
          styleTag.id = "__single-page-print__";
          styleTag.textContent = `@page { size: 8.5in ${heightIn}in; margin: 10mm; }`;
          document.head.appendChild(styleTag);
          window.__printStyleTag = styleTag;
          setTimeout(() => window.print(), 80);
        }));
      } else {
        window.__printStyleTag = null;
        window.print();
      }
    };
    const after = () => {
      document.documentElement.removeAttribute("data-print");
      document.querySelectorAll(".contact-list li.pdf").forEach((el) => {
        el.style.removeProperty("display");
      });
      const s = window.__printStyleTag;
      if (s) { s.remove(); window.__printStyleTag = null; }
    };
    window.addEventListener("afterprint", after);
    return () => window.removeEventListener("afterprint", after);
  }, []);

  return (
    <React.Fragment>
      <TopBar theme={theme} toggleTheme={toggleTheme} openCmd={() => setCmdOpen(true)} d={d} />
      <div className="resume-shell">
        <Sidebar d={d} />
        <div>
          <Main d={d} t={t} />
          <KitFooter d={d} />
        </div>
      </div>
      {cmdOpen && <CommandPalette d={d} onClose={() => setCmdOpen(false)} toggleTheme={toggleTheme} />}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Skills & Proficiency" />
        <TweakSelect label="Style" value={t.skillStyle}
                     options={["Bars", "Segments", "Rings", "Tags"]}
                     onChange={(v) => setTweak("skillStyle", v)} />
        <TweakRadio label="Fill" value={t.skillFill}
                    options={["Oxide", "Mono", "Duo"]}
                    onChange={(v) => setTweak("skillFill", v)} />
        <TweakRadio label="Sort" value={t.skillSort}
                    options={["Level", "Group", "Authored"]}
                    onChange={(v) => setTweak("skillSort", v)} />
        <TweakRadio label="Columns" value={String(t.skillCols)}
                    options={["1", "2", "3"]}
                    onChange={(v) => setTweak("skillCols", v)} />
        <TweakToggle label="Show %" value={t.showPercent}
                     onChange={(v) => setTweak("showPercent", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
