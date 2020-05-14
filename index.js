const fs = require('fs')
const matter = require('gray-matter')
const yaml = require('js-yaml')
const globby = require('globby')
const isEqual = require('lodash.isequal')
const sortBy = require('lodash.sortby')

const markdownLoad = s => {
  const { content, data } = matter(s)
  return { ...data, content }
}

const readFile = filepath => fs.readFileSync(filepath, 'utf8')

const readFiles = pattern => globby.sync(pattern).map(readFile)

const getConfig = filepath => yaml.safeLoad(fs.readFileSync(filepath, 'utf8'))

const isEqualWithoutOrder = (a, b) =>
  Array.isArray(a) && Array.isArray(b)
    ? isEqual(sortBy(a), sortBy(b))
    : isEqual(a, b)

const filterFolder = (folder, format, field, value) => {
  const unfiltered =
    format === 'yml'
      ? readFiles(`${folder}/*.yml`).map(yaml.safeLoad)
      : readFiles(`${folder}/*.md`).map(markdownLoad)
  return unfiltered.filter(object => isEqualWithoutOrder(object[field], value))
}

const getData = config =>
  config.collections.reduce((data, c) => {
    let tmpData
    if (c.folder) {
      if (c.filter && c.filter.field && c.filter.value) {
        tmpData = filterFolder(
          c.folder,
          c.format,
          c.filter.field,
          c.filter.value
        )
      } else {
        tmpData =
          c.format === 'yml'
            ? readFiles(`${c.folder}/*.yml`).map(yaml.safeLoad)
            : readFiles(`${c.folder}/*.md`).map(markdownLoad)
      }
      if (c.sortableFields && c.sortableFields[0]) {
        data[c.name] = sortBy(tmpData, c.sortableFields[0])
      } else {
        data[c.name] = tmpData.slice()
      }
    }

    if (c.files) {
      data[c.name] = c.files.reduce((fdata, { file, ...fc }) => {
        fdata[fc.name] =
          fc.format === 'yml'
            ? yaml.safeLoad(readFile(file))
            : markdownLoad(readFile(file))

        return fdata
      }, {})
    }

    return data
  }, {})

module.exports = {
  getConfig,
  getData,
}
