# Nordus

Promise based HTTP client for the node.js using Fetch

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

## License

[MIT](LICENSE)
