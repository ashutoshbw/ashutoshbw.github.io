+++
title = "Template literals and tagged template literals"
date = 2022-03-13
[taxonomies]
tags = ["javascript"]
+++

*Template literal*s are a handy way to include any values inside a string. With template literals, you always get a string value.

*Tagged template literal*s give you complete freedom over the return value of a template literal and provide access to its parts through a function called the _tag function_.

Here, we will take an in-depth look at both of them. However, I will not include the practical usages and examples of tagged template literals so that you can focus on understanding how they work without becoming overwhelmed. After going through this article, you will have all the required knowledge to study any of their practical examples.

Let's start exploring.

## Bird's-eye view

First, let's take a bird's-eye view of both of them.

### Template literals(aka untagged template literals)

```javascript
let n = 9;
let squareStr = `The square of ${n} is ${n * n}.`;
console.log(squareStr);
// The square of 9 is 81.

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

### Tagged template literals(aka tagged templates)

With tagged templates we can get access to the individual parts of a template literal and return any value we wish!

For this we need a function to tag to the template literal:

```javascript
function highlightInsertedParts(templateStrings, ...substitutions) {
  // console log to see what's in templateStrings and substitutions

  let result = templateStrings[0];
  for (let i = 1; i < templateStrings.length; i++) {
    result += `👉${substitutions[i - 1]}👈${templateStrings[i]}`;
  }
  return result;
}
```

<aside class="admonition">
<header>
<b>Info</b>: What does the <code>...</code> mean?
</header>

It says pack the rest of the arguments given to the function `highlightInsertedParts` into an array called `substitution`. Such parameters are known as _rest parameters_. For more info see [Rest parameters of JavaScript](@/blog/rest-parameter/index.md).

</aside>

Now we can tag this function to a template literal to create a tagged template literal:

```javascript
highlightInsertedParts`${1}`;
// '👉1👈'

highlightInsertedParts`This is ${"cool"}.`;
// 'This is 👉cool👈.'
```

If you don't understand it fully, don't worry. This example will make full sense, once you go through this article.

## Deep dive

### Template literal

The _template literal_ (also known as an _untagged template literal_) is somewhat like a string literal. It is written within backticks (`` ` ``). Its value is **always** a string. It provides the following unique advantages that string literals do not offer:

#### String interpolation

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
<b>Info</b>: How can I get a backtick or a placeholder literally in the string value?
</header>

You will need to escape them with backslashes(`\`):

```js
const escapedStr = `\`This is a \${'template'} literal too\``;
console.log(escapedStr);
// `This is a ${'template'} literal too`
```

</aside>

#### Multiline strings

As we have already seen in the Bird's-eye view section, you can write a multiline string just by creating real newlines in code like below:

```js
const multilineStr = `
A line
A new line
`;
```

### Tagged template literal
