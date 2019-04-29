const { getConfig, getData } = require('../index')

test('reads md data', async () => {
  const config = getConfig('__tests__/md/config.yml')
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})
