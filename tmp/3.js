(function a() {
function getSentenceFromSelection(selection) {
  if (!selection || selection.rangeCount <= 0) {
      return '';
  }
  const selectedText = selection.toString();
  if (!selectedText.trim()) {
      return '';
  }
  const range = selection.getRangeAt(0);
  // double sanity check, which is unlikely to happen due to the rangeCount check above
  /* istanbul ignore if */
  if (!range) {
      return '';
  }
  return (extractSentenceHead(extractParagraphHead(range)) +
      selectedText +
      extractSentenceTail(extractParagraphTail(range)))
      .replace(/\s+/g, ' ')
      .trim();
}
function getSentence(win = window) {
  return getSentenceFromSelection(win.getSelection());
}
function extractParagraphHead(range) {
  let startNode = range.startContainer;
  let leadingText = '';
  switch (startNode.nodeType) {
      case Node.TEXT_NODE: {
          const textContent = startNode.textContent;
          if (textContent) {
              leadingText = textContent.slice(0, range.startOffset);
          }
          break;
      }
      case Node.COMMENT_NODE:
      case Node.CDATA_SECTION_NODE:
          break;
      default:
          startNode = startNode.childNodes[range.startOffset];
  }
  // parent prev siblings
  for (let node = startNode; isInlineNode(node); node = node.parentElement) {
      for (let sibl = node.previousSibling; isInlineNode(sibl); sibl = sibl.previousSibling) {
          leadingText = getTextFromNode(sibl) + leadingText;
      }
  }
  return leadingText;
}
function extractParagraphTail(range) {
  let endNode = range.endContainer;
  let tailingText = '';
  switch (endNode.nodeType) {
      case Node.TEXT_NODE: {
          const textContent = endNode.textContent;
          if (textContent) {
              tailingText = textContent.slice(range.endOffset);
          }
          break;
      }
      case Node.COMMENT_NODE:
      case Node.CDATA_SECTION_NODE:
          break;
      default:
          endNode = endNode.childNodes[range.endOffset - 1];
  }
  // parent next siblings
  for (let node = endNode; isInlineNode(node); node = node.parentElement) {
      for (let sibl = node.nextSibling; isInlineNode(sibl); sibl = sibl.nextSibling) {
          tailingText += getTextFromNode(sibl);
      }
  }
  return tailingText;
}
function extractSentenceHead(leadingText) {
  // split regexp to prevent backtracking
  if (leadingText) {
      const puncTester = /[.?!。？！…]/;
      /** meaningful char after dot "." */
      const charTester = /[^\s.?!。？！…]/;
      for (let i = leadingText.length - 1; i >= 0; i--) {
          const c = leadingText[i];
          if (puncTester.test(c)) {
              if (c === '.' && charTester.test(leadingText[i + 1])) {
                  // a.b is allowed
                  continue;
              }
              return leadingText.slice(i + 1);
          }
      }
  }
  return leadingText;
}
function extractSentenceTail(tailingText) {
  // match tail                                                       for "..."
  const tailMatch = /^((\.(?![\s.?!。？！…]))|[^.?!。？！…])*([.?!。？！…]){0,3}/.exec(tailingText);
  // the regexp will match empty string so it is unlikely to have null result
  return tailMatch ? tailMatch[0] : /* istanbul ignore next */ '';
}
function getTextFromNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || /* istanbul ignore next */ '';
  }
  else if (node.nodeType === Node.ELEMENT_NODE) {
      return node.innerText || /* istanbul ignore next: SVG? */ '';
  }
  return '';
}
function isInlineNode(node) {
  if (!node) {
      return false;
  }
  switch (node.nodeType) {
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
      case Node.CDATA_SECTION_NODE:
          return true;
      case Node.ELEMENT_NODE: {
          switch (node.tagName) {
              case 'A':
              case 'ABBR':
              case 'B':
              case 'BDI':
              case 'BDO':
              case 'BR':
              case 'CITE':
              case 'CODE':
              case 'DATA':
              case 'DFN':
              case 'EM':
              case 'I':
              case 'KBD':
              case 'MARK':
              case 'Q':
              case 'RP':
              case 'RT':
              case 'RTC':
              case 'RUBY':
              case 'S':
              case 'SAMP':
              case 'SMALL':
              case 'SPAN':
              case 'STRONG':
              case 'SUB':
              case 'SUP':
              case 'TIME':
              case 'U':
              case 'VAR':
              case 'WBR':
                  return true;
          }
      }
  }
  return false;
}
return getSentence()
})()
