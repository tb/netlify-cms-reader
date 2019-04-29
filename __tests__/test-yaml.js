const { getConfig, getData } = require('../index')

test('reads yaml data', async () => {
  const config = getConfig('__tests__/yaml/config.yml')
  const data = await getData(config)
  expect(data).toMatchSnapshot()
})
