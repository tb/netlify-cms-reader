const fs = require('fs')
const matter = require('gray-matter')
const yaml = require('js-yaml')
const globby = require('globby')

const markdownLoad = s => {
  const { content, data } = matter(s)
  return { ...data, content }
}

const readFile = filepath => fs.readFileSync(filepath, 'utf8')

const readFiles = pattern => globby.sync(pattern).map(readFile)

const getConfig = filepath => yaml.safeLoad(fs.readFileSync(filepath, 'utf8'))

const getData = config =>
  config.collections.reduce((data, c) => {
    if (c.folder) {
      data[c.name] =
        c.format === 'yml'
          ? readFiles(`${c.folder}/*.yml`).map(yaml.safeLoad)
          : readFiles(`${c.folder}/*.md`).map(markdownLoad)
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
