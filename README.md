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

### Bower tasks

Use bower to perform all the tasks. For example to run tests call:

    $ bower test

If you want to run server, simply call:

    $ bower server

Etc. etc... All the available commands are listed in `Gruntfile.js` and 
are generally default ones provided by Yeoman!

### Editor configuration

Your editor or IDE should follow indentation rules described in `.editorconfig`
dotfile. 
