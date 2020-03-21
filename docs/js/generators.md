---
id: generators
title: Generators
sidebar_label: Generators
---

## Generators functions

Normal JS functions will execute everything inside them once being called, while generators functions can do it step by step. You can decide, when the next part of the function will be called.

### Generator function simple example

```javascript
function* myGeneratorFn() {
  console.log("Start");
  yield;
  console.log("End");
}

const output = myGeneratorFn();
output.next();
```

The function myGeneratorFn() will be called and it will stop after the first console.log with 'Start' output. Using next() function call on the generator function instance (called output) will make the function continue the execution and the output will be the next console log 'End'.

### Pass values IN and FROM the generator function to its instance

```javascript
function* myGeneratorFn() {
  yield "foo";

  const bar = yield;
  console.log(bar);
}

const output = myGeneratorFn();
output.next();
output.next();
output.next("bar");
```

The output of this generator function will be:

- The first output.next() call will return an object {value: 'foo', done: false}. We get the 'foo' value and the done flag, which indicates if the generator function is finished (is the last yield).
- The next output.next() call will stop at constant assignment.
- And the last output.next() call will pass a value which will be assigned to the constant bar. This constant is then printed out in the console.

Here we can see how to pass a value to the generator function with passing a parameter to the yield method and how to get a value from the generator function by reading the response from the yield method which is an object with a value and done keys.

### Handling errors with generator function

If an error happens outside the generator function and we would like to let the generator function know and stop it, we can use the throw() method.

```javascript
function* myGeneratorFn() {
  try {
    const foo = yield;
    console.log(foo);
  } catch (err) {
    console.error("ERROR ", err);
  }
}

const output = myGeneratorFn();
output.next();
output.throw("Something went wrong");
```

### Iterating over a generator function

If a generator function has a lot of yield statements, we should not manualy call next() method for each one of them. ES6 comes with for of loop, which helps in these occasions.

```javascript
function* myGeneratorFn() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
}

const output = myGeneratorFn();

for (let i of output) {
  console.log(i);
}
```

### Call a generator function inside another generation function

The code bellow is self explanatory.

```javascript
function* missingYield() {
  yield 3;
  return 4;
}

function* myGeneratorFn() {
  yield 1;
  yield 2;
  const missing = yield* missingYield(); // yield 3
  console.log(missing); // print in console the returned value 4
  yield 5;
}

for (let i of myGeneratorFn()) {
  console.log(i);
}
```
