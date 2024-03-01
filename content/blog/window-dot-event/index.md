+++
title = "Don't use `window.event`"
date = 2022-04-17
[taxonomies]
tags = ["javascript", "dom"]
[extra]
description= "A warning on using event.window"
+++

Suppose you have the following HTML and JavaScript:

```html
<button id="btn">Click me</button>
```

```js
let myBtn = document.querySelector("#btn");

myBtn.addEventListener("click", () => {
  console.log(event);
});
```

What do you think clicking on the button will happen?

If you think it will not work, saying `event` is not defined or something like this, you will surprisedly get the right `Event` object for that event, unless your browser has stopped caring about it.

What actually happens is that `event` is a read-only property of `window` and outside of event handlers, this `event` is always `undefined`. But when an event happens, only inside that corresponding event handler, it has respective `Event` object as it's value if your browser has support for it.

<aside class="admonition">
<header>
<b>Warning</b>
</header>

It's not recommended by [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/event) and is a deprecated feature and it may be dropped if supported. So you should avoid accessing `Event` objects like this and instead use the first parameter of event handler for accessing it. For example:

```js
myBtn.addEventListener("click", (event) => {
  console.log(event);
});
```

</aside>
