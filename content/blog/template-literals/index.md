+++
title = "Template literals and tagged template literals"
date = 2022-03-13
[taxonomies]
tags = ["javascript"]
[extra]
katex = true
+++

*Template literal*s are a handy way to include any values inside a string. With template literals, you always get a string value.

*Tagged template literal*s give you complete freedom over the return value of a template literal and provide access to its parts through a function called the _tag function_.

Here, we will take an in-depth look at both of them. However, I will not include the practical usages and examples of tagged template literals so that you can focus on understanding how it works without becoming overwhelmed. After going through this article, you will have all the required knowledge to study any of their practical examples.

Let's start exploring.

## Template literal

The _template literal_ (also known as an _untagged template literal_) is somewhat like a string literal. It is written within backticks (`` ` ``). Its value is **always** a string. It provides the following unique advantages that string literals do not offer:

- Multiline strings
- String interpolation

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

### String interpolation

We can place any expression within `${}`, which is called a **placeholder**. The given expression within it is called a **substitution**. A placeholder must contain a substitution. Text pieces separated by placeholders are called **template strings**. JavaScript evaluates the substitutions and, in this process, converts them to strings if they are not and joins all of its individual parts in respective order to return a string value. This idea is called _string interpolation_. Below is an example:

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

## Tagged template literal

Tagged template literal is also called _tagged template_ for short.<sup data-fnref>[exploringjs]</sup> It is made up of a template literal tagged onto a expression like below:

```js
expression`template literal`;
```

Here,

- The `expression` which must evaluate to a function. This function is called **tag function**.
- `template literal` stands for just any template literal or more specifically any _untagged template literal_. There is no hidden semantics here.

JavaScript calls the tag function by passing it parts of the template literal next to it in a specific way. The return value of this function is the value of the tagged template.

To understand the tag function works properly we need to understand two concepts: the **cooked** and **raw** interpretation of _template strings_, because tag function gives us access to both forms:

- **Cooked interpretation** means the backslashes have special meaning. For example `\n` will produce a single character which is a newline character.
- **Raw interpretation** means backslashes don't have special meaning. So `\n` will produce two characters: `\` and `n`.

Finally, we are ready to understand the _tag function_ really well. JavaScript gives us access to the parts of its template literal through its arguments, as described below:

- **1st argument**: This is an array holding the cooked interpretation of _template strings_. However if a template string holds incorrect syntax of the following kind of escape sequences then the corresponding array element of that template string will hold `undefined`.

  - Unicode codepoint escapes (eg. `\u{1F642}`)
  - Unicode unit escapes (eg. `\u03A3`)
  - Hexadecimal escapes (eg. `\x41`)

  This array has a `raw` named property which holds all the raw interpretation of the template strings.

  <aside class="admonition">
  <header>
    <b>Info</b>

  If untagged template literal or string literal holds incorrect syntax of the above escape sequences, JavaScript will throw error.

  </header>

  </aside>

- **Remaining arguments**: These are the evaluated values of the _substitutions_. Note that these are not converted to strings from other types of values.

The return value of tag function is the value of the tagged template. This value can be anything.

That's it. Now you know how it works. Do the exercises below to make sure you understand it really well.

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

Except doing code golf<sup data-fnref>[codegolf]</sup> I don't recommened using `join` and `concat` like this.

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
Write the <i>tag function</i> <code>highlight</code> that outputs like like below:

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

- [Rest parameter of JavaScript](@/blog/rest-parameter/index.md)
- [How the JavaScript reduce and reduceRight Methods Work](https://www.freecodecamp.org/news/how-reduce-reduceright-works-javascript/)

</details>

## Further study

For digging more or to study practical usages, here are some good resources:

- [JavaScript for impatient programmers (ES2022 edition)](https://exploringjs.com/impatient-js/ch_template-literals.html)
- [CSS Tricks](https://css-tricks.com/template-literals/)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

## Footnotes

- [exploringjs] [Exploring ES6](https://exploringjs.com/es6/ch_template-literals.html#sec_introduction-template-literals) by [Dr. Axel Rauschmayer](https://dr-axel.de/)
- [codegolf] [Code golf](https://en.wikipedia.org/wiki/Code_golf)
