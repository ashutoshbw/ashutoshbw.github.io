+++
title = "Into the `void` of TypeScript"
date = 2024-03-29
[taxonomies]
tags = ["typescript"]
[extra]
status = "draft"
importance = 4
certainty = "highly likely"
description = "A study on the void type of TypeScript."
+++

The TypeScript type `void` refers to function return value that is meant to be ignored.[_refs:void_]

Just like any other type you can annotate variables with `void`. But its not useful there. It's only useful in the context of functions.

## Inferred `void` type

When a function doesn't explicitly return a value[_notes:explicitReturn_], it usually means that its return value does not serve a purpose and can be ignored. So TypeScript infers it to be of type `void`.

```ts
function sayHello() {
  console.log("hello");
}
```

Above the inferred return type of `sayHello` is `void`.

## Explicit `void` return type

Of a literal function definition[_notes:fd_] with a `void` return type, TypeScript will give you error if you return anything other than `undefined`.[_notes:undefined_] If TypeScript would allow returning other values, it wouldn't create a type system violation. This error reporting is helpful for catching bugs that might arise from refactoring[_refs:void-undefined_]:

```ts
// Old version
function fn(arr: number[]): void {
  const arr1 = arr.map((x) => {
    return 3;
  });
}

// New version
function fn(arr: number[]): void {
  for (const x of arr) {
    // Oops, meant to do something else
    return 3;
  }
}
```

## `void` vs `undefined`

## Notes {#notes}

- [explicitReturn] A function that explicitly returns something has a `return` statement with a return value.
- [fd] It doesn't matter if it is the definition a function statement or function expression.
- [undefined] `undefined` is always assignable to `void`.

## References {#refs}

- [void] [`no-invalid-void-type` typescript-eslint rule](https://typescript-eslint.io/rules/no-invalid-void-type/)
- [void-undefined] [Why does TypeScript have both `void` and `undefined`?](https://stackoverflow.com/questions/58885485/why-does-typescript-have-both-void-and-undefined)
