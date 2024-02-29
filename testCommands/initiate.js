/* eslint-disable no-useless-escape */
const { SlashCommandBuilder } = require('discord.js')
const { Database } = require('sqlite3')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('initiate')
    .setDescription('Permet d\'initialiser les tables SQL dans le cas ou elles ne le sont pas!'),
  async execute (interaction) {
    try {
      const db = new Database('Database.sqlite')

      db.run(
                `CREATE TABLE IF NOT EXISTS members_xp (
                    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    userId TEXT NOT NULL UNIQUE,
                    userName TEXT NOT NULL DEFAULT 'default',
                    xp INTEGER NOT NULL DEFAULT 0,
                    level INTEGER NOT NULL DEFAULT 1,
                    time INTEGER NOT NULL DEFAULT 0 
                )`
      )

      db.run(
                `CREATE TABLE IF NOT EXISTS tournois (
                    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    tournamentNumber INTEGER NOT NULL,
                    tounarmentName TEXT NOT NULL,
                    prizeList TEXT NOT NULL,
                    teamSize INTEGER DEFAULT '1',
                    partOneUserList TEXT NOT NULL DEFAULT '[]',
                    partTwoUserList TEXT NOT NULL DEFAULT '[]',
                    running INTEGER DEFAULT '1'
                )
                `
      )

      db.close()

      interaction.reply("Les tables de données ont été initialisés dans le cas ou elles ne l'étaient pas!")
    } catch (e) {
      interaction.reply('Une erreur est survenue:\n\`' + e + '\`')
    }
  }
}

/*
id: int;
tournamentNumber:  int
TournamentName: string;
PrizeList: [string];
teamSize: int
running: boolean (0 Tournois terminé | 1 Tournois en attente | 2 Tournois commencé)

ROUND SUISSE:

partOneUserList: [{
    id: int,
    userId: string,
    userName: string,
    fight: [{
        opponent: {
            id: int,
            userId: string,
            userName: string,

        }
        result: WIN | LOOSE | null
    }]
}]

FINALES:

partTwoUserList: [{
    id: int,
    roundPlace: int
    userId: string,
    userName: string,
    fight: [{
        opponent: {
            id: int,
            userId: string,
            userName: string,

        }
        result: WIN | LOOSE | null
    }]
}]

*/
