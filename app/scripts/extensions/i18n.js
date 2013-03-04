'use strict';

var app = angular.module('app');

/**
 * @ngdoc factory
 * @name ng.factory:LocaleDictionary
 *
 * @description
 * This is an entity for I18n dictionaries. This factory shouldn't be
 * accessed directly - it is ment to be used internally by the `i18n`
 * translation service.
 */
function LocaleDictionary($http, $locale, $log) {
    return {
        get: function (localeId, fallback, callback) {
            var dictUrl = '/locales/' + localeId + '.json'
              , self = this;
            
            $http({method: 'GET', url: dictUrl, cache: true})
                .error(function () {
                    $log.error('Couldn\'t get language data for "' + localeId + '"');
                    
                    if (fallback !== undefined) {
                        $log.info('Falling back to default locale "' + localeId + '"');
                        self.get(fallback, undefined, callback);
                    }
                })
                .success(function (data) {
                    $log.info('Locale data dictionary loaded for "' + localeId + '"');
                    callback(data);
                });
        }
    };
}

app.factory('LocaleDictionary', ['$http', '$locale', '$log', LocaleDictionary]);

/**
 * @ngdoc service
 * @name ng.service:i18n
 *
 * @description
 * I18n service is responsible for all the localization stuff along your
 * application. It loads locale dictionaries and provides bunch of functions
 * to translate your texts.
 *
 * # Usage
 *
 * Inject `i18n` to your application runner or main controller and initialize
 * dictionaries:
 *
 * <pre>
 * app.run(['i18n', function (i18n) {
 *   i18n.init();
 * }]);
 * </pre>
 *
 * You can also pass initial locale to `i18n.init()`, just like here:
 *
 * <pre>
 * i18n.init('en-us');
 * </pre>
 *
 * Eventually, you can change language at any time:
 *
 * <pre>
 * i18n.setLocale('en-us');
 * </pre>
 *
 * To translate your stuff you have `translate` and `translateN` functions
 * (with shortcuts `t` and `tn`) available.
 *
 * <pre>
 * i18n.t('Hello, {{user}}!', {user: 'John'});
 * i18n.tn('You have {} components installed!', components.length);
 * </pre>
 *
 * Both functions take a scope as last argument.
 */
function i18n($locale, $interpolate, $rootScope, LocaleDictionary) {
    var DEFAULT_LOCALE = 'en';
    
    return {
        BRACE: /\{\}/g,
        dict: {},
        currentLocale: $locale.id,

        init: function (localeId) {
            if (localeId) {
                this.currentLocale = localeId;
            }
            
            this.loadDictionary();
        },
        setLocale: function (localeId) {
            this.currentLocale = localeId;
            this.loadDictionary();
            
            return localeId;
        },
        loadDictionary: function () {
            var self =  this;
            $rootScope.i18nReady = false;

            LocaleDictionary.get(this.currentLocale, DEFAULT_LOCALE, function (dict) {
                self.dict = dict;
                
                $rootScope.i18nReady = true;
                $rootScope.$broadcast('localeDictionaryLoaded');
            });
        },
        getTranslation: function (key) {
            return this.dict[key] || key;
        },
        getTranslationN: function (key, count) {
            var whens = this.dict[key];
            
            if (whens === undefined || !whens) {
                return key;
            }

            return whens[count] || whens[$locale.pluralCat(count)] || key;
        },
        translate: function (key, scope) {
            var translation = this.getTranslation(key) || key;
            return $interpolate(translation)(scope);
        },
        t: function (key, scope) {
            return this.translate(key, scope);
        },
        translateN: function (key, count, scope) {
            var translation = this.getTranslationN(key, count);
            translation = translation.replace(this.BRACE, count);
            return $interpolate(translation)(scope);
        },
        tn: function (key, count, scope) {
            return this.translateN(key, count, scope);
        }
    };
}

app.service('i18n', ['$locale', '$interpolate', '$rootScope', 'LocaleDictionary', i18n]);

/**
 * @ngdoc directive
 * @name ng.directive:t
 * @restrict A
 *
 * @description
 * Gettext-like translation directive.
 *
 * # Usage
 * It's simple, you just specify your translation which includes all the
 * interpolated stuff in a `t` attribute:
 *
 * <pre>
 * <h1 t="Hello {{userName}}!">Hello John!</h1>
 * </pre>
 *
 * The content of the element is just an example text.
 *
 * # Pluralization
 * Pluralization works very similar to `ngPluralize` directive from Angular.
 * The only difference is that you don't have to specify all the whens in
 * your view. You give only one key translation in `t` attribute and specify
 * number which is going to pluralize this message in `count` attribute.
 *
 * <pre>
 * <h2 t="You have {} installed components" count="components.length">
 *   You have 3 installed components
 * </h2>
 * </pre>
 *
 * Translated message, similary to `ngPluralize` will include pluralization
 * counter in the place of `{}` brackets.
 *
 * In some cases translated string can be inserted as HTML. To enable this
 * feature you have to add `html` attribute to the tag.
 *
 * <pre>
 * <p t="Made with love in Montevideo" html>Made with love</p>
 * </pre>
 *
 * Now, provided translation can include raw HTML, for example:
 *
 * <pre>
 *   "Made with love in Montevideo": "Made with <i class=\"icon-heart\"></i> in Montevideo",
 * </pre>
 *
 * Yeah, you guessed, I did this feature to insert icons :P.
 *
 * @param {string} t The text to be translated (a translation key).
 * @param {string|expression} count The variable to be bounded to when pluralize.
 * @param {string} html If present then translation will be insterted as html.
 */
function tDirective($rootScope, $interpolate, i18n) {
    return {
        restrict: 'A',
        
        link: function (scope, element, attr) {
            var template = element.attr(attr.$attr.t)
              , isHtml = (element.attr('html') !== undefined)
              , countExp = attr.count
              , isPlural = !!countExp
              , startSymbol = $interpolate.startSymbol()
              , endSymbol = $interpolate.endSymbol();

            var callback = function () {
                var translation;

                if (isPlural) {
                    var count = parseFloat(scope.$eval(countExp));
                    translation = i18n.getTranslationN(template, count);
                } else {
                    translation = i18n.getTranslation(template);
                }

                if (!!translation) {
                    if (isPlural) {
                        translation = translation.replace(i18n.BRACE, startSymbol + countExp + endSymbol);
                    }

                    var interpolateFn = $interpolate(translation);
                    element.addClass('ng-binding').data('$binding', interpolateFn);

                    if (isHtml) {
                        element.html(interpolateFn(scope));
                    } else {
                        element.text(interpolateFn(scope));
                    }
                }
            };

            scope.$on('localeDictionaryLoaded', callback);
            attr.$observe('t', callback);

            if (isPlural) {
                scope.$watch(countExp, callback);
            }
        }
    };
}

app.directive('t', ['$rootScope', '$interpolate', 'i18n', tDirective]);