+++
title = "Into the `void` of TypeScript"
date = 2024-03-29
updated = 2024-03-31
[taxonomies]
tags = ["typescript"]
[extra]
status = "finished"
importance = 4
certainty = "certain"
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

## `void` return type in literal function defnition

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

## `void` return type in contextual function type

Contextual typing occurs when the type of an expression is implied by its location.[_refs:contextual-typing_]

A _contextual function type_ provides context to the function that is placed in the context.

A contextual function type with `void` return type when implemented, can return _any_ value, but it will be ignored.

This behavior exists so that the following code is valid even though `Array.prototype.push` returns a number and the `Array.prototype.forEach` method expects a function with a return type of `void`.[_refs:assignability-of-func_]

```ts
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

A question that might be on your mind is:

> When an implementation of a contextual function type with a `void` return type is assigned to a variable, what type does this variable have?

Whatever that function returns, the variable would be of type `void`. This is good because the return value of the function was not intended to be used.

```ts
type voidFuncType = () => void;

const f: voidFuncType = () => {
  return true;
};

const v = f();
```

Above the type of `v` is `void`.

## `void` vs `undefined`

A contextual function type with `undefined` return type when implemented, must return `undefined`. For the case of `void`, the return value doesn't matter.

```ts
type undefinedFuncType = () => undefined;

const f: undefinedFuncType = () => {
  return true;
};
```

TypeScript will yell at this code.

## `void` vs `any`

```ts
type anyFuncType = () => any;
type voidFuncType = () => void;

const anyFunc: anyFuncType = () => {
  return "f1";
};

const voidFunc: voidFuncType = () => {
  return "f2";
};

const anyValue = anyFunc();

const voidValue = voidFunc();

anyValue.trim(); // No error
voidValue.trim(); // Error
```

With `void` return type we can ensure that the consumers of `voidFunc` will get an error when accessing properties of its return value. And with `any` there is no error, and no help from TypeScript!

## Notes {#notes}

- [explicitReturn] A function that explicitly returns something has a `return` statement with a return value.
- [fd] It doesn't matter if it is the definition a function statement or function expression.
- [undefined] `undefined` is always assignable to `void`.

## References {#refs}

- [void] [`no-invalid-void-type` typescript-eslint rule](https://typescript-eslint.io/rules/no-invalid-void-type/)
- [void-undefined] [Why does TypeScript have both `void` and `undefined`?](https://stackoverflow.com/questions/58885485/why-does-typescript-have-both-void-and-undefined)
- [contextual-typing] [Contextual Typing, TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/type-inference.html#contextual-typing)
- [assignability-of-func] [Assignability of Functions, More on Functions, TyeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#assignability-of-functions)
