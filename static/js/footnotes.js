const footnoteHeading = document.querySelector("#footnotes");

function getFnDefsMap() {
  const originalFnDefList = footnoteHeading.nextElementSibling;
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
        result[token] = item;
      } else {
        console.warn("Unreferenced footnote exist:", item.textContent);
      }
    }
    return result;
  }, {});
}

function elt(name) {
  const e = document.createElement(name);
  return e;
}

function transformFnRef() {
  const footnoteRefs = [...document.querySelectorAll("[data-fn]")];
  const defMap = getFnDefsMap();
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

    console.log(defMap);
    if (defMap[token]) {
      ol.append(defMap[token]);
    }
  });

  footnoteHeading.replaceWith(secElt);
  secElt.insertAdjacentElement("afterbegin", footnoteHeading);
}

transformFnRef();
