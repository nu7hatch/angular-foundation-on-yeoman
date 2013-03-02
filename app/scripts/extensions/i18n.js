'use strict';

// Define I18n factory which is going to load current locale data
// from served resources.
app.factory('i18n', function I18n($locale, $log, $http, $interpolate, $rootScope) {
    var dict = {}
      , currentLocale = $locale.id
      , defaultLocale = 'en';
    
    (function loadDict(locale, ignoreError) {
        var url =  '/locales/' + locale + '.json';
        
        $http({method: 'GET', url: url, cache: true})
            .error(function() {
                $log.error("Couldn't get language data for: " + locale);
                
                if (!ignoreError) {
                    $log.info("Falling back to default locale");
                    loadDict(defaultLocale, true);
                }
            })
            .success(function(data) {
                dict = data;
                
                $log.info('Language data loaded for "' + locale + '"');
                $rootScope.i18nReady = true;
                $rootScope.$broadcast('languageDataLoaded');
            });
    })(currentLocale, false);

    $rootScope.i18n = {
        getTranslation: function(key) {
            return dict[key];
        },
        getTranslationN: function(key, count) {
            var whens = dict[key];
            if (whens == undefined || !!whens) return key;
            return whens[count] || whens[$locale.pluralCat(count)] || key;
        },
        translate: function(key, scope) {
            var translation = getTranslation(key) || key;
            return $interpolate(translation, scope);
        },
        t: function(key, scope) {
            return this.translate(key, scope);
        },
        translateN: function(key, count, scope) {
            var translation = getTranslationN(key, count) || key;
            return $interpolate(translation, scope);
        },
        tn: function(key, count, scope) {
            return this.pluralTranslate(key, scope);
        }
    };
}).$inject = ['$locale', '$log', '$http', '$interpolate', '$rootScope'];

// Define a translation directive.
app.directive('t', function($rootScope, $interpolate) {
    var BRACE = /{}/g;
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var template = element.attr(attr.$attr.t)
              , countExp = attr.tPlural
              , isPlural = !!countExp;

            var callback = function(value) {
                var translation;

                if (isPlural) {
                    var count = parseFloat(scope.$eval(countExp))
                      , startSymbol = $interpolate.startSymbol()
                      , endSymbol = $interpolate.endSymbol();
                    
                    var t = $rootScope.i18n.getTranslationN(template, count);
                    translation = t.replace(BRACE, startSymbol + countExp + endSymbol);
                } else {
                    translation = $rootScope.i18n.getTranslation(template);
                }

                if (!!translation) {
                    var interpolateFn = $interpolate(translation);
                    element.addClass('ng-binding').data('$binding', interpolateFn);
                    element.text(interpolateFn(scope));
                }
            };

            scope.$on('languageDataLoaded', callback);
            attr.$observe('t', callback);

            if (isPlural) {
                scope.$watch(countExp, callback);
            }
        }
    };
}).$inject = ['$rootScope', '$interpolate'];