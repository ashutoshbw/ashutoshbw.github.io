function elt(name) {
  const e = document.createElement(name);
  return e;
}

function getFnDefsMap(fnHeadingElt) {
  const originalFnDefList = fnHeadingElt.nextElementSibling;
  originalFnDefList.remove();

  const originalFnDefListItems = [...originalFnDefList.children];

  return originalFnDefListItems.reduce((result, item, i) => {
    const firstNode = item.firstChild;

    if (firstNode.nodeType == 3) {
      const tokenRegex = /^\[(\w+)\]\s?/;
      const match = firstNode.textContent.match(tokenRegex);
      if (match) {
        const token = match[1];
        firstNode.textContent = firstNode.textContent.replace(tokenRegex, "");
        item.id = "fn-" + token;
        if (!result[token]) {
          result[token] = item;
        } else {
          console.warn(
            `Footnote definition ignored for duplicate token("${token}"): ${item.textContent}`,
          );
        }
      } else {
        console.warn(`Footnote definition lacks a token: ${item.textContent}`);
      }
    }
    return result;
  }, {});
}

function transformFnRef() {
  const footnoteHeading = document.querySelector("#footnotes");
  const footnoteRefs = [...document.querySelectorAll("[data-fn]")];
  const defMap = getFnDefsMap(footnoteHeading);
  const ol = elt("ol");

  const secElt = elt("section");
  secElt.setAttribute("role", "doc-endnotes");
  secElt.setAttribute("aria-labelledby", "footnotes");
  secElt.append(ol);

  footnoteRefs.forEach((refElt, i) => {
    const token = refElt.getAttribute("data-fn");

    const anchor = elt("a");
    const sup = elt("sup");
    sup.textContent = `[${i + 1}]`;
    anchor.innerHTML = refElt.innerHTML;
    anchor.append(sup);
    anchor.href = `#fn-${token}`;
    refElt.replaceWith(anchor);

    if (defMap[token]) {
      ol.append(defMap[token]);
      delete defMap[token];
    } else {
      console.warn(
        `Footnote definition not found for a reference of the token "${token}"`,
      );
    }
  });

  for (const [token] of Object.entries(defMap)) {
    console.warn(
      `Footnote definition of token "${token}" lacks a matching reference`,
    );
  }

  footnoteHeading.replaceWith(secElt);
  secElt.insertAdjacentElement("afterbegin", footnoteHeading);
}

transformFnRef();
