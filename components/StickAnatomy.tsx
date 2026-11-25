"use client";

import { useState } from "react";
import type { Dict } from "@/content/i18n/en";

// One click takes the stick apart in 3D: the three layers separate and a cross-section shows the inside.
// The four parts describe a typical bamboo-core incense stick; the wording comes from the language files.
// `compact` is the landing-page version: the stick with part names only, no descriptions.
// All geometry and motion is in globals.css (".anatomy"), because the site's security policy forbids inline styles.
export function StickAnatomy({ t, compact }: { t: Dict["anatomy"]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={compact ? "anatomy anatomy-hero" : "anatomy anatomy-full"} data-open={open} dir="ltr">
      <button type="button" className="anatomy-stage" aria-pressed={open} aria-label={open ? t.ariaClose : t.ariaOpen} onClick={() => setOpen(!open)}>
        <span className="stick-spin" aria-hidden="true">
          <span className="stick3d">
          <span className="layer core">
            <i>1</i>
          </span>
          <span className="layer base">
            <i>2</i>
          </span>
          <span className="layer coat">
            <i>3</i>
            <b className="ember">
              <i>4</i>
            </b>
          </span>
          <span className="xsection">
            <em>{t.inside}</em>
          </span>
          </span>
        </span>
        <span className="anatomy-hint">{open ? t.close : t.open}</span>
      </button>

      {compact ? (
        <ol className="anatomy-legend">
          {t.parts.map((p, i) => (
            <li key={p.name}>
              <span aria-hidden="true">{i + 1}</span>
              {p.name}
            </li>
          ))}
        </ol>
      ) : (
        <ol className="anatomy-parts">
          {t.parts.map((p, i) => (
            <li key={p.name}>
              <span aria-hidden="true">{i + 1}</span>
              <div>
                <h3 className="display text-3xl">{p.name}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
