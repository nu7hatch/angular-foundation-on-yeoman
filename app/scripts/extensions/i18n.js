'use strict';

function I18n($locale, $log, $http, $interpolate, $rootScope) {
    var dict = {}
      , currentLocale = $locale.id
      , defaultLocale = 'en';
    
    (function loadDict(locale, ignoreError) {
        var url =  './locales/' + locale + '.json';
        
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
                
                $log.info("Language data loaded for: " + locale);
                $rootScope.i18nReady = true;
                $rootScope.$broadcast('languageDataLoaded');
            });
    })(currentLocale, false);

    $rootScope.i18n = {
        getTranslation: function(key) {
            return dict[key];
        }
    };
}

// Define I18n factory which is going to load current locale data
// from served resources.
app.factory('i18n', ['$locale', '$log', '$http', '$interpolate', '$rootScope', I18n]);

function translateDirective($rootScope, $interpolate) {
    return {
        restrict: 'A',
        compile: function(element, attr) {
            var template = element.attr(attr.$attr.t);
            element.data('$template', template);
            return this.link;
        },
        link: function(scope, element, attr) {
            var template = element.data('$template');

            var callback = function(value) {
                var translation = $rootScope.i18n.getTranslation(template);

                if (!!translation) {
                    var interpolateFn = $interpolate(translation);
                    element.addClass('ng-binding').data('$binding', interpolateFn);
                    element.text(interpolateFn(scope));
                }
            };

            scope.$on('languageDataLoaded', callback);
            attr.$observe('t', callback);
        }
    };
};

// Define a translation directive.
app.directive('t', ['$rootScope', '$interpolate', translateDirective]);