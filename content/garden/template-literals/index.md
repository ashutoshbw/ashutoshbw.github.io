+++
title = "Template literals and tagged template literals"
date = 2022-03-13
updated = 2024-02-28
[taxonomies]
tags = ["javascript"]
[extra]
katex = true
+++

In JavaScript, *literal*s represent values that you provided literally in code, not through variables.

The word "_template_" in English means "_a thing that is used as a model for producing other similar examples_".[_refs:templateDict_]

Template literal allows you to easily express a model for producing strings that look similar. This is possible because template literals can be made up of static texts with dynmaic parts in between.

Tagged template literal allows you to _tag_ a template literal to the end of a function name. What happens then is that the function gets called with the template literal's static and dynamic parts giving you enormous power to produce any values you need by returning it from the function.

In this note I will go over all the theoretical stuffs about them that you need to know. Let's start exploring.

## Template literal

The _template literal_ (also known as an _untagged template literal_) is somewhat like a string literal. It is written within backticks (`` ` ``). Its value is **always** a string. It has two features:

- String interpolation
- Multiline strings

Let's see them in detail.

### String interpolation

This is what makes template literals _template_.

You can place any expression within `${}`. This is called a _placeholder_.

The given expression within it is called a _substitution_. A placeholder must contain a substitution.

Text pieces separated by placeholders are called _template strings_.

JavaScript evaluates the substitutions and, in this process, converts them to strings if they are not and joins all of its individual parts in respective order to return a string value. This idea is called _string interpolation_. Below is an example:

```js
console.log(`JavaScript is ${new Date().getFullYear() - 1995} years old.`);
// JavaScript is 29 years old.
```

[Figure 1](#fig-1) shows the names of the parts of above template literal.

<figure id="fig-1">
{{ img(name="template-literal.png", alt= "Parts of a template literal.", scale=0.85) }}
<figcaption><b>Figure 1</b>: Parts of a template literal.</figcaption>
</figure>

Let's see another interesting example:

```js
console.log(`Let's put an array: ${[1, `${[2.1, 2.2]}`, 3]}!`);
// Let's put an array: 1,2.1,2.2,3!
```

Note that, the feature that substitution can be _any_ JavaScript expression allows you to compose _nested template literals_!

<aside class="admonition">
<header>
<b>Question</b>: How can I get a backtick or a placeholder literally in the string value?
</header>

You will need to escape them with backslashes(`\`):

```js
const escapedStr = `\`This is a \${'template'} literal too\``;
console.log(escapedStr);
// `This is a ${'template'} literal too`
```

</aside>

### Multiline strings

Now you can write a multiline string just by creating real newlines in code like below:

```javascript
let poem = `
from my bed
I watch
3 birds
on a telephone
wire.
  -- Charles Bukowski 
`;
console.log(poem);
// output
/*
from my bed
I watch
3 birds
on a telephone
wire.
  -- Charles Bukowski 
*/
```

## Tagged template literal

Tagged template literal is also called _tagged template_ for short.[_refs:exploringjs_] It is made up of a template literal tagged onto a function name or more precisely a function expression like below:

```js
funcitonExpression`template literal`;
```

Here the function expression is called the _tag function_.

JavaScript calls the tag function by passing it parts of the template literal next to it. The return value of this function is the value of the tagged template. This value can be anything.

JavaScript provides arguments to the tag function like below:

- **1st argument**: This is an array holding the cooked interpretation[_cooked_] of _template strings_. However if a template string holds incorrect syntax of the following kind of escape sequences then the corresponding array element of that template string will hold `undefined`.

  - Unicode codepoint escapes (eg. `\u{1F642}`)
  - Unicode unit escapes (eg. `\u03A3`)
  - Hexadecimal escapes (eg. `\x41`)

  This array has a `raw` named property which holds raw interpretation[_raw_] of the template strings.

  <aside class="admonition">
  <header>
    <b>Info</b>

  If untagged template literal or string literal holds incorrect syntax of the above escape sequences, JavaScript will throw error.

  </header>

  </aside>

- **Remaining arguments**: These are the evaluated values of the _substitutions_. Note that these are not converted to strings from other types of values.

That's all the theoretical stuff you need to know to be confident in using it. Do the exercises below to make sure you understand it really well.

## Exercises

<details>
<summary>
What will the output of the following codes?

```js
'\unicode is awesome'
`\unicode is awesome`
```

</summary>

JavaScript will throw error because invalid unicode escape sequences are not allowed in string and template literals.

</details>

<details>
<summary>
What will be the output of the following line?

```js
((...args) => args[0].raw[0])`\unicode is awesome`;
```

</summary>

```js
"\\unicode is awesome";
```

</details>

<details>
<summary>
How is it possible?

```js
["one", "two", "three"].join` -> `.concat` ---> 💥`;
// 'one -> two -> three ---> 💥'
```

</summary>

`join` and `concat` are not built as tag functions but here they are treated as tag functions.

They both get as their first argument, an array containing a single string. These functions then convert these arrays to strings to continue their job and we get the above output.

Note that if you use placeholders in the template literal, the result will probably not be as expected:

```js
"Hello ".concat`Jimmy, ${"Peter"} and ${"John"}! Welcome`;
// 'Hello Jimmy, , and ,! WelcomePeterJohn'
```

Except doing code golf[_refs:codegolf_] I don't recommened using `join` and `concat` like this.

</details>

<details>
<summary>
If there are $n$ substitutions, what is the length of the array that we get as the first argument of <i>tag function</i>?
</summary>

$$
n + 1
$$

This is always true. For example:

```js
tagFunc`${"one"} and two and ${"three"}`;
```

In this case the array will be `['', ' and two and ', '']`. If we didn't get that empty strings, it would be impossible for the tagFunc to decide the order of the parts of the template literal. Say thanks to these useful empty strings!

</details>

<details>
<summary>
Implement <code>highlight</code> that works like below:

```js
highlight`${1}`;
// '👉1👈'

highlight`This is ${"cool"}.`;
// 'This is 👉cool👈.'
```

</summary>

The `reduce` method makes it really easy to do:

```js
const highlight = (strs, ...values) =>
  strs.reduce((result, str, i) => `${result}👉${values[i - 1]}👈${str}`);

console.log(highlight`${1}`);
console.log(highlight`This is ${"cool"}.`);

// '👉1👈'
// 'This is 👉cool👈.'
```

If you are new to the `...` dots syntax above or the `reduce` method, I've written in-depth articles on them. I hope you will find them will helpful:

- [Rest parameter of JavaScript](@/garden/rest-parameter/index.md)
- [How the JavaScript reduce and reduceRight Methods Work](https://www.freecodecamp.org/news/how-reduce-reduceright-works-javascript/)

</details>

## Conclusion

Congratulations! This article was dense with information. Now you know what template literal and tagged template literals are and how they works. Tagged template literals are not used as often as template literals but they have some interesting practical use cases worth knowing.

For digging more or to study practical usages of tagged template literals, here are some good resources:

- [JavaScript for impatient programmers (ES2022 edition)](https://exploringjs.com/impatient-js/ch_template-literals.html)
- [CSS Tricks](https://css-tricks.com/template-literals/)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

## Notes {#notes}

- [cooked] _Cooked interpretation_ means the backslashes have special meaning. For example `\n` will produce a single character which is a newline character.
- [raw] _Raw interpretation_ means backslashes don't have special meaning. So `\n` will produce two characters: `\` and `n`.

## References {#refs}

- [templateDict] [Meaning of "template" from Oxford Learner's Dictionary](https://www.oxfordlearnersdictionaries.com/definition/english/template)
- [codegolf] [Code golf](https://en.wikipedia.org/wiki/Code_golf)
- [exploringjs] [Exploring ES6](https://exploringjs.com/es6/ch_template-literals.html#sec_introduction-template-literals) by [Dr. Axel Rauschmayer](https://dr-axel.de/)
