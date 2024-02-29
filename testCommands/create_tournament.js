const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js')
const { Database } = require('sqlite3')
const { getMedal } = require('../utils/utils')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create_tournament')
    .setDescription('Permet de créer un tournois')
    .addStringOption(option =>
      option
        .setName('nom')
        .setRequired(true)
        .setDescription('Nom du tournois')
    )
    .addIntegerOption(option =>
      option
        .setName('format')
        .setRequired(true)
        .setDescription('Nom du tournois')
        .addChoices({
          name: '1 vs 1',
          value: 1
        }, {
          name: '2 vs 2',
          value: 2
        }, {
          name: '3 vs 3',
          value: 3
        })
    )
    .addStringOption(option =>
      option
        .setName('prix')
        .setRequired(true)
        .setDescription('Prix du tournois (mettre tous les prix séparé d\'une virgule (ex: \'100$,50$,10$\`)')
    ),
  async execute (interaction) {
    const author = {
      name: interaction.user.globalName,
      iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.user.id + '/' + interaction.user.avatar
    }

    const prizeList = JSON.stringify(interaction.options.getString('prix').split(','), null, 2)

    const db = new Database('Database.sqlite')

    db.all('SELECT * FROM tournois', [], async (error, value) => {
      if (error) {
        console.error(error)
        return
      }

      const alreadyRunning = value.find(tournois => tournois.running)
      if (alreadyRunning) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('Erreur')
          .setAuthor(author)
          .setDescription(`Un tournoi est déjà en ${alreadyRunning === 1 ? 'attente' : 'cours'}!`)

        await interaction.reply(
          { embeds: [embed] }
        )
        return
      }

      const tournamentNumber = (value.filter(tournois => tournois.teamSize === interaction.options.getInteger('format'))).length + 1

      db.run(`
                INSERT into tournois (tournamentNumber, tounarmentName, prizeList, teamSize) values (?, ?, ?, ?)
            `, [tournamentNumber, interaction.options.getString('nom'), prizeList, interaction.options.getInteger('format')])

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setAuthor(author)
        .setTitle(`Le tournoi ${interaction.options.getString('nom')} a été crée avec succès!`)
        .setDescription(`Format: ${interaction.options.getInteger('format')} vs ${interaction.options.getInteger('format')}`)

      const prices = interaction.options.getString('prix').split(',')
      for (let i = 0; i < prices.length; i++) {
        embed.addFields({
          name: 'Place: ' + getMedal(i - 1),
          value: `**${prices[i]}**`
        })
      }

      interaction.reply({
        embeds: [embed]
      })
    })
  }
}
