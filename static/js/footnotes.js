function elt(name) {
  const e = document.createElement(name);
  return e;
}

function getUniqueId(startString) {
  let id = startString;
  let count = 0;
  while (document.getElementById(id)) {
    id = `${startString}-${count++}`;
  }
  return id;
}

function initFootnotes() {
  // First the footnote parts
  const fnHeadingElt = document.querySelector("#footnotes");

  // TODO: throw error if not <ul>
  const ul = fnHeadingElt.nextElementSibling;
  ul.remove();

  const tokenToFootnote = {};
  for (let i = 0; i < ul.children.length; i++) {
    const li = ul.children[i];
    const firstNode = li.firstChild;

    if (firstNode.nodeType == 3) {
      const tokenRegex = /^\[(\w+)\]\s?/;
      const match = firstNode.textContent.match(tokenRegex);
      if (match) {
        const token = match[1];
        firstNode.textContent = firstNode.textContent.replace(tokenRegex, "");

        li.id = getUniqueId(`fn-${token}`);

        if (!tokenToFootnote[token]) {
          const backlinkWrapper = elt("span");
          li.append(backlinkWrapper);
          tokenToFootnote[token] = li;
        } else {
          console.warn(
            `Footnote ignored for duplicate token("${token}"): ${li.textContent}`,
          );
        }
      } else {
        console.warn(`Footnote lacks a token: ${li.textContent}`);
      }
    }
  }

  // Now let's handle the references and also built the new footnote section at the same time
  // Gathering all <sup> footnote reference elements
  const sups = [...document.querySelectorAll("[data-fnref]")];
  const ol = elt("ol");
  const secElt = elt("section");
  const tokenToRefs = {}; // it will be need to build backlinks

  secElt.append(ol);

  let uniqueTokenCount = 0;

  for (let i = 0; i < sups.length; i++) {
    const sup = sups[i];
    const token = sup.textContent.slice(1, -1);

    // this is for a single token, that is for a single footnote
    let refs = tokenToRefs[token];

    if (!refs) {
      refs = [];
      uniqueTokenCount++;
      tokenToRefs[token] = refs;
    }

    const matchingFootnote = tokenToFootnote[token];

    const anchor = elt("a");
    anchor.textContent = `[${uniqueTokenCount}]`;

    if (matchingFootnote) {
      refs.push(anchor);
      anchor.href = `#${matchingFootnote.id}`;
      anchor.id = getUniqueId(`${matchingFootnote.id}-ref-${refs.length}`);

      const backlinkAnchor = elt("a");
      backlinkAnchor.href = `#${anchor.id}`;
      backlinkAnchor.textContent = "a";
      matchingFootnote.lastChild.append(backlinkAnchor);

      ol.append(matchingFootnote);
    } else {
      anchor.style.color = "red";
      console.warn(`Footnote missing for token "${token}"`);
    }

    sup.replaceChildren(anchor);
    sup.removeAttribute("data-fnref");
  }

  // TODO: console warn for footnotes having no reference
  // TODO: Handle backlink

  fnHeadingElt.replaceWith(secElt);
  secElt.insertAdjacentElement("afterbegin", fnHeadingElt);
}

initFootnotes();

function charPattern(charsSeq) {
  return (pattern) => {
    let makeLastPartMadeOfFirstChar = false;
    for (let i = pattern.length - 1; i >= 0; i--) {
      const posInCharsSeq = charsSeq.indexOf(pattern[i]);

      if (posInCharsSeq == charsSeq.length - 1) {
        // Is it the last char in sequence?

        if (i == 0) {
          return charsSeq[0].repeat(pattern.length + 1);
        } else {
          makeLastPartMadeOfFirstChar = true;
          continue;
        }
      } else {
        let lastPart;
        if (makeLastPartMadeOfFirstChar) {
          lastPart = charsSeq[0].repeat(pattern.length - i - 1);
        } else {
          lastPart = pattern.slice(i + 1);
        }
        return pattern.slice(0, i) + charsSeq[posInCharsSeq + 1] + lastPart;
      }
    }
  };
}
