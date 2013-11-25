ic-ajax
=======

Ember-friendly `jQuery.ajax` wrapper.

- returns RSVP promises
- makes apps more testable (resolves promises with `Ember.run`)
- makes testing ajax simpler with fixture support

Installation
------------

`bower install ic-ajax`

`npm install ic-ajax`

... or download `main.js` and include it into your app however you want.

Module Support
--------------

- AMD
- Node.JS (CJS)
- Globals

API
---

Ajax simply wraps `jQuery.ajax` with two exceptions:

- success and error callbacks are not supported
- does not resolve three arguments like $.ajax but instead an object
  with the three "arguments" as keys (real promises only resolve a
  single value and ic-ajax uses RSVP).

Other than that, use it exactly like `$.ajax`.

```js
App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return ic.ajax('/foo').then(function(result) {
      // result.response
      // result.textStatus
      // result.jqXHR
      return result.response;
    });
  }
}
```

Simplified Testing
------------------

If you add fixtures to `ic.ajax.FIXTURES` it will resolve the promise
with the fixture matching a url so you can test your app w/o creating
fake servers with sinon, etc.

Example:

```js
ic.ajax.FIXTURES = {
  'api/v1/courses': {
    response: [{name: 'basket weaving'}],
    jqXHR: {},
    textStatus: 'success'
  }
}

ic.ajax('api/v1/courses').then(function(result) {
  deepEqual(result, ic.ajax.FIXTURES['api/v1/courses']);
});
```

Contributing
------------

```sh
bower install
npm install
npm test
```

Special Thanks
--------------

Inspired by [discourse ajax][1].

License and Copyright
---------------------

MIT Style license

(c) 2013 Instructure, Inc.


  [1]:https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/mixins/ajax.js#L19

