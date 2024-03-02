+++
title = "Rest parameter of JavaScript"
date = 2023-04-10
updated = 2024-02-28
[taxonomies]
tags = ["javascript"]
+++

Have you ever dreamed of creating your own JavaScript function that can accept _any_ number arguments? Today we will learn how to do that with modern JavaScript syntax. And as you might already have guessed: the name of that syntax is _rest parameter_.

## Rest parameter

If we put 3 dots(`...`)<sup data-fnref>[dots]</sup> before the last parameter of a function, that last parameter is called _rest parameter_.

If we do so, we can access any number of arguments given to that function from the position of the rest paramter to the right, wrapped in an array<sup data-fnref>[arr]</sup>. For example:

```js
function foo(a, b, ...c) {
  console.log("a:", a);
  console.log("b:", b);
  console.log("c:", c);
}

foo(1, 2, 3, 4, 5, 6);
```

It will print the following:

```
a: 1
b: 2
c: [3, 4, 5, 6]
```

That's all there is to know about rest parameter.

## When there was no rest parameter&hellip;

From ancient times JavaScript gives all regular functions(non-arrow functions) an local variable named [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments) pointing to an array-like object that holds all the arguments we give to it. Developers faces few problems in that approach however. For example:

- Since it's not an array, array methods don't work on it.
- We need extra boilerplate code to convert `arguments` object to an actual array.

In ES6, rest parameter is introduced to overcome these limitations.

## Notes {#footnotes}

- [arr] The array that rest parameter gives us is a standard JavaScript array, which means we can use any available array method on it.
- [dots] The `...` in JavaScript can have different meanings based on where it is used. Other JavaScript syntaxes that uses `...` are [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) and [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
