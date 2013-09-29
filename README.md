# {{aggregate}} [![NPM version](https://badge.fury.io/js/helper-aggregate.png)](http://badge.fury.io/js/helper-aggregate)

> {{aggregate}} handlebars helper. Inlines content from multiple files optionally using wildcard (globbing/minimatch) patterns, extracts YAML front matter to pass to context for each file. Accepts compare function as 3rd parameter for sorting inlined files.

## Quickstart
In the root of your project, run the following in the command line:

```bash
npm i helper-aggregate --save-dev
```

## Usage

```handlebars
{{aggregate 'path/to/*.hbs'}}
```


## Usage in Assemble
In your Gruntfile, simply add `helper-aggregate` to the `helpers` property in the [Assemble](http://assemble.io) task or target options:

```javascript
grunt.initConfig({
  assemble: {
    options: {
      helpers: ['helper-aggregate']
    }
    ...
  }
});
```

With that completed, you may now use the `{{aggregate}}` helper in your Assemble project.


## Options
### sep
Type: `String`
Default value: `\n`

The separator to append after each inlined file.




## Setting options
### hash options
Set options as hash arguments.


```handlebars
---
chapter: 1
---
{{aggregate 'path/to/*.hbs' sep="\n\n\n"}}
```

### "assemble" task options
Pass [Assemble](http://assemble.io) options into the helper.

In your project's Gruntfile, options for the `{{aggregate}}` helper can be defined in the Assemble task options:

```javascript
grunt.initConfig({
  assemble: {
    options: {
      aggregate: {
        sep: '\n',
        compare_fn: 5
      }
    }
    ...
  }
});
```

Note that the options are defined in the [custom property](http://assemble.io/docs/Custom-Helpers.html), `aggregate`, not on the `options` object itself.


## Author

**Jon Schlinkert**

+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)
+ [github/jonschlinkert](http://github.com/jonschlinkert)


## License and Copyright
Licensed under the [MIT License](./LICENSE-MIT)
Copyright (c) Jon Schlinkert, contributors.