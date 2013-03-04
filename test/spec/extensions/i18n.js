'use strict';

describe('I18n', function () {
    beforeEach(module('app'));

    describe('LocaleDictionary', function () {
        var LocaleDictionary, $httpBackend;

        beforeEach(inject(function (_$httpBackend_, $injector) {
            $httpBackend = _$httpBackend_;
            LocaleDictionary = $injector.get('LocaleDictionary');            
        }));

        it('should load proper language dictionary when exists', function () {
            $httpBackend.expectGET('/locales/en-us.json').respond(200, {'Hi there!': 'Hello there!'});
            
            var dict;
            LocaleDictionary.get('en-us', undefined, function (_dict_) { dict = _dict_; });

            $httpBackend.flush();
            expect(dict['Hi there!']).toEqual('Hello there!');
        });

        it('should fall back to default dictionary when primary doesn\'t exist', function () {
            $httpBackend.expectGET('/locales/es.json').respond(404, '');
            $httpBackend.expectGET('/locales/en-us.json').respond(200, {'Hi there!': 'Hello there!'});

            var dict;
            LocaleDictionary.get('es', 'en-us', function (_dict_) { dict = _dict_; });

            $httpBackend.flush();
            expect(dict['Hi there!']).toEqual('Hello there!');
        });
    });

    describe('i18n service', function () {
        var i18n, $httpBackend, scope;

        beforeEach(inject(function (_$httpBackend_, $injector, $locale, $rootScope){
            $httpBackend = _$httpBackend_;
            $locale.id = 'en-us';
            i18n = $injector.get('i18n');
            scope = $rootScope;
        }));

        var mockLocale = {
            'Test': 'Ok!',
            'Hi {{name}}!': 'Hello {{name}}!',
            '{} things': {
                '0': 'nothing',
                '1': 'one thing',
                'other': '{} things'
            }
        };
        
        function expectMockLocale() {
            $httpBackend.expectGET('/locales/en-us.json').respond(200, mockLocale);
        };

        it('currentLocale should be set to default one from $locale', function () {
            expect(i18n.currentLocale).toEqual('en-us');
        });

        it('init() should load locale dictionary', function () {
            spyOn(i18n, 'loadDictionary');
            i18n.init();
            expect(i18n.loadDictionary).toHaveBeenCalled();
        });

        it('init() should set current locale if passed as an argument', function () {
            spyOn(i18n, 'loadDictionary');
            i18n.init('es');
            expect(i18n.currentLocale).toEqual('es');
        });

        it('setLocale() should set current locale and reload dictionary', function () {
            spyOn(i18n, 'loadDictionary');
            i18n.setLocale('pl');
            expect(i18n.currentLocale).toEqual('pl');
            expect(i18n.loadDictionary).toHaveBeenCalled();
        });

        it('loadDictionary() should load dictionary for the current language', function () {
            expectMockLocale();

            i18n.currentLocale = 'en-us';
            i18n.loadDictionary();

            $httpBackend.flush();
            expect(i18n.dict['Test']).toEqual('Ok!');
        });

        it('loadDictionary() should notify about data loaded via $routeScope\'s event', function () {
            expectMockLocale();

            i18n.currentLocale = 'en-us';
            i18n.loadDictionary();
            expect(scope.i18nReady).toBe(false);

            var ok = false;
            scope.$on('localeDictionaryLoaded', function () { ok = true; });
            
            $httpBackend.flush();
            expect(ok).toBe(true);
            expect(scope.i18nReady).toBe(true);
        });

        it('getTranslation() should return translation for the specified text', function () {
            i18n.dict = mockLocale;

            expect(i18n.getTranslation('Test')).toEqual('Ok!');
            expect(i18n.getTranslation('Empty')).toBe('Empty');
        });

        it('getTranslation() should return back the key when translation not found', function () {
            i18n.dict = mockLocale;

            expect(i18n.getTranslation('Empty')).toBe('Empty');
        });
        
        it('getTranslationN() should return translation for pluralized text', function () {
            i18n.dict = mockLocale;

            expect(i18n.getTranslationN('{} things', 0)).toEqual('nothing');
            expect(i18n.getTranslationN('{} things', 1)).toEqual('one thing');
            expect(i18n.getTranslationN('{} things', 4)).toEqual('{} things');
        });

        it('getTranslationN() should return back the key if translation not found', function () {
            i18n.dict = mockLocale;

            expect(i18n.getTranslationN('{} somethings', 2)).toEqual('{} somethings');
        });

        it('translate() should preform translation of given message', function () {
            i18n.dict = mockLocale;

            expect(i18n.translate('Test')).toBe('Ok!');
            expect(i18n.translate('Hi {{name}}!', {name: 'John'})).toBe('Hello John!');
        });

        it('t() should be an alias for translate()', function () {
            spyOn(i18n, 'translate');
            i18n.t('foo', 'bar');

            expect(i18n.translate.mostRecentCall.args).toEqual(['foo', 'bar']);
        });

        it('translateN() should perform plural translation of given message', function () {
            i18n.dict = mockLocale;

            expect(i18n.translateN('{} things', 3)).toEqual('3 things');
            expect(i18n.translateN('{} superthings', 5)).toEqual('5 superthings');
        });

        it('tn() should be an alias for translateN()', function () {
            spyOn(i18n, 'translateN');
            i18n.tn('foo', 2, 'bar');

            expect(i18n.translateN.mostRecentCall.args).toEqual(['foo', 2, 'bar']);
        });
    });
});