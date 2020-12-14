const { getConfig, getData } = require('../index')

test('reads md data', async () => {
  const config = getConfig('__tests__/md/config.yml')
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})

test('reads md data with filtered folder collections', async () => {
  const config = getConfig(
    '__tests__/md/config-with-filtered-folder-collections.yml'
  )
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})

test('honors first of the sortableField list', async () => {
  const config = getConfig(
    '__tests__/md/config-with-sortableField-in-folder-collections.yml'
  )
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})
