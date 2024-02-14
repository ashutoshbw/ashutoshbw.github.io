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
