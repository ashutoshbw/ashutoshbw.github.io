+++
title = "Deep dive into `<`, `>`, `<=` and `>=` operators of JavaScript"
date = 2023-04-10
updated = 2024-03-01
[taxonomies]
tags = ["javascript"]
+++

| Operator | Name                  |
| -------- | --------------------- |
| `<`      | Less than             |
| `>`      | Greater than          |
| `<=`     | Less than or equal    |
| `>=`     | Greater than or equal |

You have propbably used these operators countless times to compare numbers in your programming journey with JavaScript without any problems.

But did you know that JavaScript can compare not only numbers but also all kinds of values? While this may seem strange, it has some useful use cases, especially when comparing ASCII[_refs:asciiunicode_] strings of same case. While exploring these comparisons, I found the process of comparing numbers, strings and how the operators `>`, `<=`, `>=` derived from <, to be quite interesting. In this article, I will share with you everything that If found useful or interesting while exploring these operators. Let's start.

They are part of a set of operators known as _comparison operators_.[_refs:compops_][_othercompops_] These operators are also part of a set of operators officially known as _relational operators_.[_refs:relops_][_otherrelops_]

To make life simple and easy, here I will ignore all the less useful comparisons and only go into the depth of the most useful ones:

- I will only write about the comparisons of Number, BigInt and String types.
- I will ignore the cases where the types of the operands differ(I think it's better to explicitly convert values to the same type before comparing them to make things clear).

## The less than operator(`<`)

This is a crucial operator because the other three operators(`>`, `<=` and `>=`) are based on it. So I will go into its depth as much as I find worthwhile and then will see how easy it to learn about the inner workings of the other three operators.

### Comparing Numbers

These are mostly as in mathematics. For example:

```js
4 < 6; // true
10 < 9; // false
```

As values Number type have a limited precision[_refs:numprecision_], for very long numbers literals you might get incorrect result when comparing them. For example:

```js
3 < 3.00000000000000001; // false

88888888888888888 < 88888888888888889; // false
```

This is because these numbers loose some precision when they are turned into values from literals.

For comparing `leftNumber < rightNumber` where `leftNumber` and `rightNumber` are values(not literals!) of Number type, the following algorithm is used:

1. If either value is `NaN` return `false`.
2. If `leftNumber` is the same number as `rightNumber`, return `false`.
3. If `leftNumber` is `Infinity`, return `false`.
4. If `rightNumber` is `Infinity`, return `true`.
5. If `leftNumber` is `-Infinity`, return `true`.
6. If `rightNumber` is `-Infinity`, return `false`.
7. If `leftNumber` is less than `rightNumber` as in mathematics, return `true`. Otherwise return `false`.

### Comparing BigInts

As BigInts don't have NaN or infinities, and they have arbitrary precision, they work just as fine as in mathematics.

```js
88888888888888888n < 88888888888888889n; // true
```

### Comparing Strings

`<` operator uses a simple _lexicographic ordering_[_lex_] for comparing string values which can become handy when we know how it works and we don't need any advanced comparison.

Let `leftString` and `rightString` are strings and we want to know how JavaScript evaluates the value of the expression `leftString < rightString`. Here goes the algorithm:

1. If `leftString` starts with `rightString`, return `false`. For example:

   ```js
   "hello world" < "hello";
   // false

   "hello world" < "";
   // false, because every string starts with an empty string
   ```

2. If `rightString` starts with `leftString`, return `true`. For example:

   ```js
   "hello" < "hello world";
   // true

   "" < "hello world";
   // true
   ```

3. At this point, as neither string starts with the other, there must be a smallest index where code units[_refs:codeunit_] of the two strings are different. Let `s` be that index. In the following example `s` is `4`:

   ```js
   "Linux" < "Linus Torvalds";

   getCodeUnits("Linux");
   // [76, 105, 110, 117, 120]

   getCodeUnits("Linus Torvalds");
   // [76, 105, 110, 117, 115, 32,
   // 84, 111, 114, 118, 97, 108, 100, 115]
   ```

   <details>
   <summary>See <code>getCodeUnits</code> implementation[_refs:codeunit_]</summary>

   ```js
   function getCodeUnits(s) {
     let result = [];
     for (let i = 0; i < s.length; i++) {
       result.push(s.charCodeAt(i));
     }
     return result;
   }
   ```

   </details>

4. Let `m` be `leftString.charCodeAt(s)`.[_refs:charCodeAt_]
5. Let `n` be `rightString.charCodeAt(s)`.[_refs:charCodeAt_]
6. If `m < n` return `true`, otherwise return `false`.

   For the example at step 3, `m` is `120` and `n` is `115`, so `'Linux' < 'Linus Torvalds'` is `false`!

Note that comparison with `<` is not like dictionaries in all cases, for example when lowercase, uppercase or accents are involved. But for simple comparisons like comparing two lowercase English letters or words, it works just fine because they fall under ASCII subset of Unicode.[_refs:asciiunicode_]

Luckily JavaScript now allows proper language aware comparison through the awesome [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) object. It is beyond the scope of this article.

Let's now see how the other three operators work.

## Greater than operator: `>`

`leftValue > rightValue` can be described as below:

1. If both operands are of Number type and either one is `NaN`
   1. Return `false`.
2. Return `rightValue < leftValue`.[_evalorder_]

## Less than or equal operator: `<=`

`leftValue <= rightValue` can be described as below:

1. If both operands are of Number type and either one is `NaN`
   1. Return `false`.
2. If `rightValue < leftValue` is `true`[_evalorder_]
   1. Return `false`.
3. Else
   1. Return `true`.

## Greater than or equal operator: `>=`

`leftValue >= rightValue` can be described as below:

1. If both operands are of Number type and either one is `NaN`
   1. Return `false`.
2. If `leftValue < rightValue` is `true`
   1. Return `false`.
3. Else
   1. Return `true`.

## Notes {#notes}

- [othercompops] The other comparison operators `==`, `===`, `!=` and `!==`.
- [otherrelops] There are two relational operators that are not comparison operators: `in` and `instanceof`.
- [lex] The heavy phrase "Lexicographic ordering" means an ordering similar to the alphabetic ordering of the dictionaries.
- [evalorder] JavaScript always evaluates expressions from left to write while reading its source code. Here though the `rightValue` appears to the left, it would not make it evalutate before the `leftValue` because `leftValue` appeared to the left in initial expresssion that this algorithm is about.

## References {#refs}

- [charCodeAt] [`String.prototype.charCodeAt()` - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
- [codeunit] [How JavaScript strings are made?](@/blog/how-strings-are-made/index.md)
- [compops] [Comparison operators - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#comparison_operators)
- [relops] [Relational Operators - ECMAScript Language Specification](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators)
- [numprecision] [How numbers are encoded in JavaScript](https://2ality.com/2012/04/number-encoding.html)
- [asciiunicode] [What's the difference between ASCII and Unicode?](https://stackoverflow.com/questions/19212306/whats-the-difference-between-ascii-and-unicode)
