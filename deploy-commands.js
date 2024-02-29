const { REST, Routes } = require('discord.js')
const { clientId, guildId, token, testBotClientId, testBotToken, testMode } = require('./config.json')
const fs = require('node:fs')

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

if (testMode) {
  const rest = new REST({ version: '10' }).setToken(testBotToken)

  rest.put(Routes.applicationCommands(testBotClientId), { body: [] })
    .then(() => console.log('Successfully deleted all test application commands.'))
    .catch(console.error);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} test application (/) commands.`)
      const data = await rest.put(
        Routes.applicationGuildCommands(testBotClientId, guildId),
        { body: commands }
      )

      console.log(`Successfully reloaded ${data.length} test application (/) commands.`)
    } catch (error) {
      console.error(error)
    }
  })()
} else {
  const rest = new REST({ version: '10' }).setToken(token)

  rest.put(Routes.applicationCommands(clientId), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error)
  
  const testRest = new REST({ version: '10' }).setToken(testBotToken)
  testRest.put(Routes.applicationCommands(testBotClientId), { body: [] })
    .then(() => console.log('Successfully deleted all test application commands.'))
    .catch(console.error);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`)
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      )

      console.log(`Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
      console.error(error)
    }
  })()
}
