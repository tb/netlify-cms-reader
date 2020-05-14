const { getConfig, getData } = require('../index')

test('reads yaml data', async () => {
  const config = getConfig('__tests__/yaml/config.yml')
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})

test('reads yaml data with filtered folder collections', async () => {
  const config = getConfig(
    '__tests__/yaml/config-with-filtered-folder-collections.yml'
  )
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})

test('honors first of the sortableField list', async () => {
  const config = getConfig(
    '__tests__/yaml/config-with-sortableField-in-folder-collections.yml'
  )
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})
