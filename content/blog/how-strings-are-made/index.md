+++
title = "How strings are made in JavaScript?"
date = 2024-03-01
[taxonomies]
tags = ["javascript"]
+++

For the dumb computers to make sense of JavaScript strings, they must be encoded in some way. JavaScript does it using _UTF-16_.

What is UTF-16? It stands for _16-bit Unicode Transformation Format_. But what's that mean? It means a string in JavaScript is a sequence of 16 bit code units. You might be asking what's a code unit?

Well a _code unit_ is a number to encode a code point. What is a code point? A _codepoint_ is also a number composed of a single 16 bit code unit or two 16 bit code units. Each character is encoded as one or more codepoints in unicode.

A string gets an index at each code unit for holding that part of the string.

The concept of _character_ is hard to define. For simplicity we can define it like below:

- Any symbol that doesn't seems broken.
- The invisible things that allows you to do space, tabs and newlines.

We can write a function to get the decimal values of the code units of a string:

```js
function getCodeUnits(s) {
  let result = [];
  for (let i = 0; i < s.length; i++) {
    result.push(s.charCodeAt(i));
  }
  return result;
}

getCodeUnits("Hi 😄");
// [72, 105, 32, 55357, 56836]

getCodeUnits("I ❤️‍🔥 JS");
// [73, 32, 10084, 65039, 8205, 55357, 56613, 32, 74, 83]
```

Note that the 😄 emoji needs 2 code units and the ❤️‍🔥 needs 5 code units.
