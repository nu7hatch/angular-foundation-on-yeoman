# AngularJS + Zurb Foundation + Yeoman = ♥

This is a scaffold for the AngularJS application powered by Zurb Foundation CSS3 
framework. Everything's wrapped up with Yeoman's magic.

## Getting started

If you setting it up for the first time, use the following script:

    $ ./setup.sh
    
It will check if you have all the required commands installed, and later will 
install all the local dependencies from `package.json` (via `npm`) file and javascript
libraries from `compontent.json` (via `bower`).

## Development

It's pretty simple and straightforward. Everything about your application will
go to `app` directory and your tests to `test`. Compiled website will be
saved in gitignored `dist` directory.

### Adding dependencies 

To install new development dependencies use `npm`. Don't forget to add them to
`package.json` file.

### Installing javascript components

To install new javascript libraries use `bower`. Javascript components will be
installed to `app/components/[component-name]` directory. Also, don't forget
to add them to `component.json` file.

If you want to use new javascript library in your application, simply load it
via `script` HTML tag in `build:js` section of `app/index.html` file.

### Grunt tasks

Use grunt to perform all the tasks. For example to run tests call:

    $ grunt test

If you want to run server, simply call:

    $ grunt server

Etc. etc... All the available commands are listed in `Gruntfile.js` and 
are generally default ones provided by Yeoman!

### Editor configuration

Your editor or IDE should follow indentation rules described in `.editorconfig`
dotfile. 

## Cool stuff

There's couple of cool extensions powering up this application. Here's
the short description of each of them:

### I18n service

AngularJS' internationalization sucks, like a lot. Generally I think that 
everything else but Gettext sucks, so here I added a sorta gettext-like I18n
module. You can define your translations in `app/locales/{locale-id}.json` file,
like this `pl.json` for example:

    {
        "How are you, {{name}}?": "Jak się masz, {{name}}?"
        "Are you {} years old?": {
            "one": "Masz roczek?",
            "few": "Masz {} lata?",
            "many": "Masz {} lat?"
        }
    }

Then you can easily use your translations in the views:

    <h1 t="How are you, {{name}}?">How are you, John?</h1>
    <p t="Are you {} years old?" t-plural="age"></p>
    
Neat, isn't it?

### Multiple layouts.

Multiple layouts and partials has been resolved simply by using `ng-include`.
Shortly, don't use `ng-view` in your app, neither set `templateUrl` in your
routes. If you wanna define a route do it this way:
    
    $routeProvider.when('/hello', {
        templates: { main: 'views/hello.html', 'sideNav': 'views/hello_nav.html },
        layout: 'views/layouts/homepage.html }
    }
    
So as you can see, you can set many views. You can also set layout for the
particular page. If you will specify the layout then `views/layouts/default.html`
will be used.

In your views you include templates this way:

    <div ng-include src="templates.main"></div>
    <div ng-include src="templates.sideNav"></div>

One more thing worth to know about layouts - all should be handled by `LayoutCtrl`:

    <div ng-controller="LayoutCtrl">
      <h1>Hello World!</h1>
      <div ng-include src="templates.main"></div>
    </div>

Controller to handle final partials should be set the same way, inline in those
partials.
