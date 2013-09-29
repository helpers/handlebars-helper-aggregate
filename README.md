# {{aggregate}} [![NPM version](https://badge.fury.io/js/helper-aggregate.png)](http://badge.fury.io/js/helper-aggregate)

> {{aggregate}} handlebars helper. Inlines content from multiple files optionally using wildcard (globbing/minimatch) patterns, extracts YAML front matter to pass to context for each file. Accepts compare function as 3rd parameter for sorting inlined files.

## Quickstart
In the root of your project, run the following in the command line:

```bash
npm i helper-aggregate --save-dev
```

In your Gruntfile, simply add `helper-aggregate` to the `helpers` property in the [Assemble](http://assemble.io) task or target options:

```javascript
grunt.initConfig({
  assemble: {
    options: {
      // the 'helper-aggregate' modules must also be listed in devDependencies
      // for assemble to automatically resolve the helper
      helpers: ['helper-aggregate', 'other/helpers/*.js']
    }
    ...
  }
});
```

With that completed, you may now use the `{{aggregate}}` helper in your templates:

```handlebars
{{aggregate 'path/to/*.hbs'}}
```




## Context & Lo-Dash templates

The helper will also process any **valid** [Lo-Dash templates](http://lodash.com/docs#template) in the YAML front matter of targeted files, using `grunt.config.data` and the context of the "current" file. For example:

```handlebars
---
title: <%= book.title %>
chapter: 1
heading: <%= book.title %> | Chapter <%= chapter %>
---
<h1>{{title}}</h1>
<p class="heading">{{heading}}</p>
```




## Options

### cwd
Type: `String` (optional)
Default value: `''`

The `cwd` for paths defined in the helper.

### sep
Type: `String`
Default value: `\n`

The separator to append after each inlined file.

### compare
Type: `Function`
Default value: `function(a, b) {return a.index >= b.index ? 1 : -1;}`

Compare function for sorting the aggregated files.





## Defining options

### hash options
Set options as hash arguments directly on the expressions themselves:

```handlebars
{{aggregate 'my/book/chapters/*.hbs' sep="<!- Chapter -->"}}
```

If defined, **options defined in the hash always win**.


### "assemble" task options

> If you use Grunt and [Assemble](http://assemble.io), you can pass options from the `assemble` task in the Gruntfile to the helper.

In your project's Gruntfile, options for the `{{aggregate}}` helper can be defined in the Assemble task options:


```js
assemble: {
  options: {
    helpers: ['helper-aggregate', 'other/helpers/*.js'],
    aggregate: {
      cwd: 'path/to/files',
      sep: '<!-- separator defined in Gruntfile -->',
      compare: function (a, b) {
        return a.index >= b.index ? 1 : -1;
      }
    }
  },
  files: {}
}
```

Note that the options are defined in `options: {aggregate: {}}`, which is a [custom property](http://assemble.io/docs/Custom-Helpers.html) in the Assemble options.



## Examples

See examples of the `{{aggregate}}` helper being used in the [yfm project](https://github.com/assemble/yfm):

#### example templates and content
* [the helper itself](https://github.com/assemble/yfm/blob/master/test/fixtures/aggregate.hbs)
* [content being aggregated by the helper](https://github.com/assemble/yfm/tree/master/test/fixtures/book)
* [the compiled result](https://github.com/assemble/yfm/blob/master/test/actual/aggregate.html)

#### example options and context
* [defining helper options](https://github.com/assemble/yfm/blob/master/Gruntfile.js#L31-L35)
* [config data used in examples](https://github.com/assemble/yfm/blob/master/Gruntfile.js#L19)



### cwd example

Instead of doing this:

```handlebars
{{aggregate 'my/book/chapters/*.hbs'}}
{{aggregate 'my/book/extras/*.hbs'}}
```

You could define the `cwd` in the `aggregate` options in your project's Gruntfile:

```javascript
assemble: {
  options: {
    helpers: ['helper-aggregate'],
    aggregate: {
      cwd: 'my/book' // "base" path to prepend
    }
  }
}
```

Now you can define paths in the templates like this:

```handlebars
{{aggregate 'chapters/*.hbs'}}
{{aggregate 'extras/*.hbs'}}
```


## Usage example

Given you have this config in your project's gruntfile:

```js
// Project configuration.
grunt.initConfig({

  // Metadata for our book.
  book: require('./metadata/book.yml'),

  assemble: {
    options: {
      helpers: ['helper-aggregate'],
      aggregate: {
        sep: '<!-- chapter -->'
      },
      book: {
        src: ['chapters.hbs'],
        dest: 'book/'
      }
    }
  }
});
```

Our `chapters.hbs` file contains the following:


```handlebars
{{{aggregate 'chapters/*.hbs'}}}
```

And the files we want to aggregate include these Lo-Dash and Handlebars templates:


```handlebars
---
title: <%= book.title %>
chapter: 1
intro: Chapter <%= chapter %>
---
<h1>Content from {{title}}</h1>
<p class="intro">{{intro}}</p>
<p class="chapter">Chapter: {{chapter}}</p>
```

The result, `book/chapters.html` would contain something like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Amazing Book</title>
  </head>
  <body>

    <!-- chapter -->
    <h1>Content from My Amazing Book</h1>
    <p class="intro">Chapter 1</p>
    <p class="chapter">Chapter: 1</p>

    <!-- chapter -->
    <h1>Content from My Amazing Book</h1>
    <p class="intro">Chapter 2</p>
    <p class="chapter">Chapter: 2</p>

    <!-- chapter -->
    <h1>Content from My Amazing Book</h1>
    <p class="intro">Chapter 3</p>
    <p class="chapter">Chapter: 3</p>
  </body>
</html>
```


## Author

**Jon Schlinkert**

+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)
+ [github/jonschlinkert](http://github.com/jonschlinkert)


## License and Copyright
Licensed under the [MIT License](./LICENSE-MIT)
Copyright (c) Jon Schlinkert, contributors.