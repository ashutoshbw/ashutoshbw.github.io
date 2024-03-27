+++
title = "Truthy and falsy values in JavaScript"
date = 2022-06-21
[taxonomies]
tags = ["javascript"]
[extra]
description= "A note on truthy and falsy values in JavaScript"
+++

Truthy values are considered as `true` and falsy values are considered as `false` in Boolean contexts for example in conditionals and logical operators.

There are only the following falsy values in JavaScript:

- The Boolean false value: `false`
- The zero value of both Number and BigInt type:
  - Number type: `0`, `-0`, `0.0`, `00`, `0x0` etc.
  - BigInt type: `0n`, `0x0n`, `0b0n` etc.
- Empty string value: `""`, `''` and ` `` `
- `undefined`, `null` and `NaN`.

All the rest of the values in JavaScript are truthy values.
