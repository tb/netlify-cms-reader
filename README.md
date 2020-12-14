# Netlify CMS Reader

Read NetlifyCMS config and data.

## Basic usage

```js
const { getConfig, getData } = require('netlify-cms-reader')

const data = await getData(getConfig('static/admin/config.yml'))
```

### Filtered Folder Collections

*Note: For filtered folder collections in `Netlify CMS`, see:
[Filtered folder collections](https://www.netlifycms.org/docs/collection-types/#filtered-folder-collections)*

If a folder collection is filtered, then that collection is returned
by applying the criteria configured in its `filter` property.

As the supported types for the filter value is *not* documented,
this implementation accepts all possible types, so a filter
with the setting `{field: tags, value: ['latest', 'most popular']}`
*is handled,* despite the fact that the UI of `Netlify CMS` (at least
with version `2.10.48`) does *not handle* it despite configuration
for it *is accepted*.


### Collections with Sortable Fields

*Note: For collections with sortable fields in `Netlify CMS`, see
[Sortable fields](https://www.netlifycms.org/docs/configuration-options/#sortable_fields)*

If a folder collection has a `sortableFields` setting, then that
collection is returned by sorting it in increasing order based on
*the first element* in the `sortableFields` array.

E.g. if a collection have a `sortableFields` setting such as `['latest', 'most popular']` then the collection will be returned with the items sorted by the
values of their `latest` field in increasing order.



## Usage with GatsbyJS

```js

const path = require('path')
const { getConfig, getData } = require('netlify-cms-reader')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const { pages } = await getData(getConfig('static/admin/config.yml'))

  pages.forEach(page => {
    createPage({
      path: page.path,
      component: path.resolve('src/templates/page.js'),
      context: { page },
    })
  })
}
```
