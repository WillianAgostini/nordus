# Nordus

Promise based HTTP client for the node.js using Fetch

## Compatibility

- Node.js v18+

## Installing

### Package manager

Using npm:

```bash
$ npm install --save nordus
```

Once the package is installed, you can import the library using `import` or `require` approach:

```js
import nordus, { get, post } from 'nordus';
```

If you use `require` for importing:

```js
const nordus = require('nordus');
```

## Example

```js
import nordus from 'nordus';
//const nordus = require('nordus'); // legacy way

// Make a request for a user with a given ID
nordus.get('https://jsonplaceholder.typicode.com/users/1')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Optionally the request above could also be done as
nordus.get('https://jsonplaceholder.typicode.com/users/1', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await nordus.get('https://jsonplaceholder.typicode.com/users/1');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
```

Performing multiple concurrent requests

```js
function getUserAccount() {
  return nordus.get('https://jsonplaceholder.typicode.com/users/1');
}

function getComments() {
  return nordus.get('https://jsonplaceholder.typicode.com/comments/1');
}

const response = await Promise.all([getUserAccount(), getComments()])
```

You can create a new instance of nordus with a custom config.

```js
const instance = nordus.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {'X-Custom-Header': 'foobar'}
});

try {
  const response = await instance.get('todos/1');
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

You can intercept requests or responses before they are handled by `then` or `catch`.

```js
const instance = create(
  {
    baseURL: "https://jsonplaceholder.typicode.com/todos/1",
    interceptors: {
      request: (err: Error, request: Request) => {
        request.headers.set("access_token", "Bearer 123");
      },
      response: (err: Error, request: NordusResponse) => {
        console.log(request);
      },
    },
  }
);
```

You can add timeout on each request.

```js
try {
  const response = await nordus.get('https://jsonplaceholder.typicode.com/todos/1', {
    timeout: 1000,
  });
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

## Interceptors

You can intercept requests or responses before they are handled by `then` or `catch`.

```js
// Add a request and response interceptor
await get("http://localhost:5000/todos/1", {
  interceptors: {
    request: async (err, request) => {
      // Do something before request is sent
      return request;
    },
    response: async (err, response) => {
      // Do something with response data
      return response;
    }
  },
});
```

You can add interceptors to a custom instance of nordus.

```js
const instance = nordus.create();
instance.interceptors.request.use(() => {/*...*/});
```

If you need to remove an interceptor later you can.

```js
const myInterceptor = instance.interceptors.request.use(() => {/*...*/});
instance.interceptors.request.eject(myInterceptor);
```

You can also clear all interceptors for requests or responses.
```js
const instance = nordus.create();
instance.interceptors.request.use(() => {/*...*/});
instance.interceptors.request.clear(); // Removes interceptors from requests
instance.interceptors.response.use(() => {/*...*/});
instance.interceptors.response.clear(); // Removes interceptors from responses
```

### Multiple Interceptors

Given you add multiple response interceptors
and when the response was fulfilled
- then each interceptor is executed
- then they are executed in the order they were added
- then only the last interceptor's result is returned
- then every interceptor receives the result of its predecessor
- and when the fulfillment-interceptor throws
    - then the following fulfillment-interceptor is not called
    - then the following rejection-interceptor is called
    - once caught, another following fulfill-interceptor is called again (just like in a promise chain).

Read [the interceptor tests](./tests/interceptors.spec.ts) for seeing all this in code.

## License

[MIT](LICENSE)
