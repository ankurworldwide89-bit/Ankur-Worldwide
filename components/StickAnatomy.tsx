"use client";

import { useState } from "react";

// A typical bamboo-core incense stick, described in general terms. Blends differ by fragrance.
const parts = [
  ["Bamboo core", "A thin bamboo splint runs the full length. Its bare end is the handle that sits in the holder."],
  ["Base paste", "Charcoal and wood powder bound with jigat, a natural bark gum, rolled around the bamboo. This is what burns slowly and evenly."],
  ["Fragrance layer", "Aromatic powders and perfume oils on the outside. Heat from the ember releases the scent."],
  ["Ember", "The lit tip. It travels down the stick, burning the paste and carrying the fragrance into the air."],
] as const;

// One click takes the stick apart in 3D: the three layers separate and a cross-section shows the inside.
// All geometry and motion is in globals.css (".anatomy"), because the site's security policy forbids inline styles.
export function StickAnatomy() {
  const [open, setOpen] = useState(false);
  return (
    <div className="anatomy" data-open={open}>
      <button
        type="button"
        className="anatomy-stage"
        aria-pressed={open}
        aria-label={open ? "Put the incense stick back together" : "Take the incense stick apart to see its layers"}
        onClick={() => setOpen(!open)}
      >
        <span className="stick3d" aria-hidden="true">
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
            <em>Inside</em>
          </span>
        </span>
        <span className="anatomy-hint">{open ? "Click to close" : "Click the stick to open it"}</span>
      </button>

      <ol className="anatomy-parts">
        {parts.map(([name, text], i) => (
          <li key={name}>
            <span aria-hidden="true">{i + 1}</span>
            <div>
              <h3 className="display text-3xl">{name}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
