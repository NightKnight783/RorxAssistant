const { SlashCommandBuilder } = require('discord.js');
const { Database } = require('sqlite3')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('initiate')
		.setDescription('Initiate Database!'),
	async execute(interaction) {

        const db = new Database("Database.sqlite")

        db.run(
            `CREATE TABLE IF NOT EXISTS members_xp (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL UNIQUE,
                userName TEXT NOT NULL DEFAULT 'default',
                xp INTEGER NOT NULL DEFAULT 0,
                level INTEGER NOT NULL DEFAULT 1,
                time INTEGER NOT NULL DEFAULT 0 
            )`
        );

        db.close()

        interaction.reply("Ok!")
	},
};