/*!
 * ember-ajax
 * - inspired by discourse ajax: https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/mixins/ajax.js#L19
 * - please see license at https://github.com/instructure/ember-ajax
 */

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['ember'], function (Ember) {
      return factory(Ember);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('ember'));
  } else {
    root.ic = root.ic || {};
    root.ic.ajax = factory(Ember);
  }
}(this, function (Ember) {

  var ajax = function() {
    var settings = parseArgs.apply(null, arguments);

    return new Ember.RSVP.Promise(function(resolve, reject) {

      // If we have FIXTURES, load from there instead (testing)
      var fixture = ajax.lookupFixture(settings.url);
      if (fixture) {
        return resolve(fixture);
      }

      settings.success = function(response, textStatus, jqXHR) {
        Ember.run(null, resolve, {
          response: response,
          textStatus: textStatus,
          jqXHR: jqXHR
        });
      };

      settings.error = function(jqXHR, textStatus, errorThrown) {
        Ember.run(null, reject, {
          jqXHR: jqXHR,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
      };

      Ember.$.ajax(settings);
    });
  };

  ajax.lookupFixture = function(url) {
    return ajax.FIXTURES && ajax.FIXTURES[url];
  };

  ajax.defineFixture = function(url, fixture) {
    ajax.FIXTURES = ajax.FIXTURES || {};
    ajax.FIXTURES[url] = fixture;
  };

  // parses arguments to support `ajax(url, settings)` or `ajax(settings)`
  function parseArgs() {
    var settings = {};
    if (arguments.length === 1) {
      if (typeof arguments[0] === "string") {
        settings.url = arguments[0];
      } else {
        settings = arguments[0];
      }
    } else if (arguments.length === 2) {
      settings = arguments[1];
      settings.url = arguments[0];
    }
    if (settings.success || settings.error) {
      throw new Error("ajax should use promises, received 'success' or 'error' callback");
    }
    return settings;
  }

  return ajax;

}));

