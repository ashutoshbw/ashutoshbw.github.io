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

function charPatternGenerator(charsSeq) {
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

const BACKLINK_CHARS_ARRAY = "abcdefghijklmnopqrstuvwxyz".split("");
const getNextPattern = charPatternGenerator(BACKLINK_CHARS_ARRAY);
const BACKLINKS_POS = "end"; // other possible value is 'start'. It controls where backlinks will appear in a footnote
const BACKLINK_SYMBOL = "↑";

function initFootnotes() {
  const fnHeadingElt = document.querySelector("#footnotes");

  const ul =
    fnHeadingElt?.nextElementSibling.tagName == "UL" &&
    fnHeadingElt.nextElementSibling;

  const tokenToFootnote = {};

  if (ul) {
    ul.remove();

    for (let i = 0; i < ul.children.length; i++) {
      const li = ul.children[i];
      let tokenNode = li.firstChild;

      while (tokenNode) {
        if (tokenNode.nodeType == 3) {
          if (tokenNode.textContent.trim() == "") {
            tokenNode = tokenNode.nextSibling;
          } else {
            break;
          }
        } else {
          // TODO: Consider other node types if required
          tokenNode = tokenNode.firstChild;
        }
      }

      if (tokenNode.nodeType == 3) {
        const tokenRegex = /^\[(\w+)\]\s?/;
        const match = tokenNode.textContent.trim().match(tokenRegex);
        if (match) {
          const token = match[1];
          tokenNode.textContent = tokenNode.textContent.replace(tokenRegex, "");

          li.id = getUniqueId(`fn-${token}`);

          if (!tokenToFootnote[token]) {
            const backlinksWrapper = elt("span");
            if (BACKLINKS_POS == "end") {
              li.append(backlinksWrapper);
            } else {
              li.prepend(backlinksWrapper);
            }
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
  }

  // Now let's handle the references and also built the new footnote section at the same time
  // Gathering all <sup> footnote reference elements
  const sups = [...document.querySelectorAll("[data-fnref]")];
  if (sups.length == 0) return;

  const ol = elt("ol");

  // It will be need to generate the ids of ref anchors.
  // It will only count refs for a token which has footnote.
  // Reason: Note that when there is no footnote for a token, there is no need to refer
  //         back to it using backlink, and thus its id is not required. And for this
  //         reason it will only count refs for a token which has footnote.
  const tokenToRefs = {};

  let uniqueTokenCount = 0;
  let cleanupFunc = () => {};
  let cleanupNeeded = false;

  for (let i = 0; i < sups.length; i++) {
    const sup = sups[i];
    const token = sup.textContent.slice(1, -1);
    const matchingFootnote = tokenToFootnote[token];
    const anchor = elt("a");

    if (!tokenToRefs[token]) {
      uniqueTokenCount++;
      if (matchingFootnote) {
        tokenToRefs[token] = [];
        ol.append(matchingFootnote);
      }
      anchor.textContent = `[${uniqueTokenCount}]`;
    } else {
      if (matchingFootnote) {
        anchor.textContent = tokenToRefs[token][0].textContent;
      } else {
        anchor.textContent = `[${uniqueTokenCount}]`;
      }
    }

    if (matchingFootnote) {
      anchor.href = `#${matchingFootnote.id}`;
      anchor.id = getUniqueId(
        `${matchingFootnote.id}-ref-${tokenToRefs[token].length}`,
      );
      tokenToRefs[token].push(anchor);
      anchor.addEventListener("click", () => {
        cleanupFunc();
        const refs = tokenToRefs[token];

        if (refs.length > 1) {
          const backlinksWrapper =
            BACKLINKS_POS == "end"
              ? matchingFootnote.lastChild
              : matchingFootnote.firstChild;

          const targetedBacklink = backlinksWrapper.querySelector(
            `[href="#${anchor.id}"]`,
          );

          cleanupFunc = () => {
            if (cleanupNeeded) {
              targetedBacklink.classList.remove("fn-targeted-backlink");
              backlinksWrapper.firstChild.replaceWith(BACKLINK_SYMBOL);
              cleanupNeeded = false;
            }
          };

          const arrowTextNode = backlinksWrapper.firstChild;
          targetedBacklink.classList.add("fn-targeted-backlink");
          const arrowBacklink = elt("a");
          arrowBacklink.textContent = BACKLINK_SYMBOL;
          arrowBacklink.href = targetedBacklink.href;
          arrowBacklink.addEventListener("click", cleanupFunc);
          arrowTextNode.replaceWith(arrowBacklink);
          cleanupNeeded = true;
        }
      });
    } else {
      anchor.style.color = "red";
      console.warn(`Footnote missing for token "${token}"`);
    }

    sup.replaceChildren(anchor);
    sup.removeAttribute("data-fnref");
  }

  Object.keys(tokenToFootnote).forEach((token) => {
    // Note that for this token, there is either an array of refs(with at least one ref) or
    // there is no entry for it in the tokenToRefs obj. This is because
    // here we are iterating over only the tokens for which there is a footnote
    // which may or may not have references. So we can safely just check for existence
    // of an array with token as key in `tokenToRefs`:
    if (!tokenToRefs[token]) {
      console.warn(`Footnote of token "${token}" have no references.`);
    }
  });

  Object.entries(tokenToRefs).forEach(([token, refs]) => {
    // Note that tokenToRefs only map tokens for which there is a
    // matching footnote.

    const li = tokenToFootnote[token];
    const backlinksWrapper =
      BACKLINKS_POS == "end" ? li.lastChild : li.firstChild;

    if (refs.length == 1) {
      const backlink = elt("a");
      backlink.textContent = BACKLINK_SYMBOL;
      backlink.href = `#${refs[0].id}`;
      backlink.addEventListener("click", () => cleanupFunc());
      backlinksWrapper.append(backlink);
    } else {
      backlinksWrapper.append(BACKLINK_SYMBOL);

      let lastPattern = BACKLINK_CHARS_ARRAY[0];
      refs.forEach((ref) => {
        const backlink = elt("a");
        const sup = elt("sup");
        sup.append(backlink);
        backlink.textContent = lastPattern;
        backlink.href = `#${ref.id}`;
        backlink.addEventListener("click", () => cleanupFunc());
        lastPattern = getNextPattern(lastPattern);
        backlinksWrapper.append(sup);
      });
    }
  });

  if (!fnHeadingElt) return;

  const secElt = elt("section");
  secElt.append(ol);
  fnHeadingElt.replaceWith(secElt);
  secElt.insertAdjacentElement("afterbegin", fnHeadingElt);
}

initFootnotes();
