const fs = require('fs')
const matter = require('gray-matter')
const yaml = require('js-yaml')
const globby = require('globby')
const { reduce } = require('p-iteration')

const markdownLoad = s => {
  const { content, data } = matter(s)
  return { ...data, content }
}

const getFiles = async patterns =>
  (await globby(patterns)).map(filepath => fs.readFileSync(filepath, 'utf8'))

const getConfig = filepath => yaml.safeLoad(fs.readFileSync(filepath, 'utf8'))

const getData = async config =>
  reduce(
    config.collections,
    async (data, c) => {
      if (c.folder) {
        data[c.name] =
          c.format === 'yml'
            ? (await getFiles(`${c.folder}/*.yml`)).map(yaml.safeLoad)
            : (await getFiles(`${c.folder}/*.md`)).map(markdownLoad)
      }

      if (c.files) {
        data[c.name] = await reduce(
          c.files,
          async (fdata, { file, ...fc }) => {
            fdata[fc.name] =
              fc.format === 'yml'
                ? await yaml.safeLoad(fs.readFileSync(file, 'utf8'))
                : await markdownLoad(fs.readFileSync(file, 'utf8'))

            return fdata
          },
          {}
        )
      }

      return await data
    },
    {}
  )

module.exports = {
  getConfig,
  getData,
}
