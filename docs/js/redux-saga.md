---
id: redux-saga
title: Redux Saga middleware
sidebar_label: Redux Saga
---

This is a redux midleware to help us handle async calls to the APIs. It uses generator functions, which are quite handy also for unit tests.

## Redux saga actions

Let's say we have a Star Wars API from where we can fetch some data. Therefore let's start having a look at a simple Redux action:

```javascript
import { call, put } from "redux-saga/effects";

export const FETCH_STAR_WARS_REQUEST = "FETCH_STAR_WARS_REQUEST";
export const FETCH_STAR_WARS_SUCCESS = "FETCH_STAR_WARS_SUCCESS";

const api = url => fetch(url).then(resp => resp.json());

export const fetchStarWarsRequest = () => ({
  type: FETCH_STAR_WARS_REQUEST
});

export function* fetchStarWars(action) {
  try {
    const sw = yield call(api, "https://swapi.co/api/people");
    yield put({ type: FETCH_STAR_WARS_SUCCESS, data: sw.results });
  } catch (e) {
    console.error(e);
  }
}
```

- We use Redux Saga effects library to help us with general functionality:
  - call - Creates a descrption of the effect. Instead of using the call function we could directly fire the native fetch function to retieve the data but then we would have problems testing this part. Using CALL will provide just the instructions to Redux Saga, in this case fire an api function with the url parameter, then Redux Saga will do the call and it will yield out the results to the SW constant.
  - put - Is the same as dispatch, it will dispatch an object to the reducer...
  - The Saga effects API can be found here --> [Saga Effects API](https://redux-saga.js.org/docs/api/)

As always we will be calling the exported function `fetchStarWarsRequest()` from our connected React components. Once the request with a specific type is dispatched, Redux Saga will be listening to the store for it and it will fire the action which is assigned to it (the gluing method will follow bellow...). The `fetchStarWars()` function will be called and here we will do an API call and a dispatch with the data received.

## Redux Saga store connection (gluing mechanism)

Once we have the actions in place, nothing will happen unless we make Saga aware of them. Now we need to connect Saga middleware with Redux... let's have a look...

This is our collection of sagas, which will then be applied to the middleware:

```javascript
import { takeLatest } from "redux-saga/effects";
import { FETCH_STAR_WARS_REQUESTS, fetchStarWars } from "actions";

function* mySaga() {
  yield takeLatest(FETCH_STAR_WARS_REQUESTS, fetchStarWars);
}

export default mySaga;
```

- The saga effect takeLatest: It will listen to the Redux store for the specific action. Once the action is dispatched it will fire the method specified as a second parameter, in this case `fetchStarWars()`. If the method is already in progress it will stop it and execute the latest requested one.

```javascript
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "reducers";
import mySaga from "sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mySaga);
```

- Where we are creating the redux store, we need to add our Saga middleware. We create a new Saga middleware using the provided method `createSagaMiddleware()` and we apply it to the Redux store with the usual `applyMiddleware()` method provided by the Redux library.
- `sagaMiddleware.run()` is used as a gluing mechanism. This will connect the generator functions in `mySaga` and the Redux store.

## Saga's blocking effects

Saga provides us blocking and non-blocking effects. A blocking effect will prevent any code to be executed before the effect ends. Let's have a look at some of them...

- The one that we already know and is blocking is the `call()` effect, which will prevent any following code to be executed before its resolved.
- `take(action)`, is a blocking effect which will take an action type for parameter and it won't continue executing the code until that action is dispatched. For example when we need to wait for additional user's input... like confirmation modal dialogs...
- `race()` will accept an object with multiple API endpoints. It will try to resolve them all at the same time but it will take only the first one which succeded and dispose all the other once. Example:

```javascript
const {one, two} = yield race({
  one: call(api, 'https://api.co/api/one/'),
  two: call(api, 'https://api.co/api/two/'),
});
```

- `all()` is similar to race effect, except it will resolve all of the specified API requests. It works in the same way as a Promise.all() method.

## Saga's non-blocking effects

This effects will not block the execution of the code in generators. Let's have a look at some of them:

- `select()` will select some data from the current Redux state
- `throtle()` will delay a method execution. We can see in the example bellow that the first parameter is the delay time, the second is an action type and the third is the method which needs to be executed:

```javascript
function* watchInput() {
  yield throttle(500, "INPUT_CHANGE", handleInput);
}
```

- `fork()` is similar to call except it won't stop the execution of other code after it. Even if it is not a blocking effect the generator function where it's being used will not be finished until all fork requests are resolved. It's usefull for example when sending some statistics to the API.
- `spawn()` is the same as fork, the only difference is that it won't block the generator function where it's being executed as it's gonna be fired in a detached task.
- `cancel()` - This is being used to cancel any currently ongoing reqests. As we can see in the example bellow, a request to get the data is ongoing but the user fires an action 'CANCELLED', which will continue the execution of the next yield and will cancel the currently ongoing data request.

```javascript
function* fetchData() {
  const data = yield call(api, "https://api.co/api/data");
  yield take("CANCELLED");
  yield cancel(data);
}
```
