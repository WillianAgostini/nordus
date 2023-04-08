# Nordus

Promise based HTTP client for the node.js using Fetch based on Axios

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
nordus.get('/user?ID=12345')
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
nordus.get('/user', {
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
    const response = await nordus.get('/user?ID=12345');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
```

Performing multiple concurrent requests

```js
function getUserAccount() {
  return nordus.get('/user/12345');
}

function getUserPermissions() {
  return nordus.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()])
  .then(function (results) {
    const acct = results[0];
    const perm = results[1];
  });
```

You can create a new instance of nordus with a custom config.

```js
const instance = nordus.create({
  baseURL: 'https://some-domain.com/api/',
  headers: {'X-Custom-Header': 'foobar'}
});

try {
    const response = await instance.get('/user?ID=12345');
    console.log(response.data);
} catch (error) {
    console.error(error);
}
```

## License

[MIT](LICENSE)
