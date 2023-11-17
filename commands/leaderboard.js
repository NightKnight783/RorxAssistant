const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { Database } = require('sqlite3')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the 10 members with the most xp.'),
	async execute(interaction) {
		
        const db = new Database("Database.sqlite")

        db.all(`SELECT * FROM members_xp ORDER BY level DESC, xp DESC LIMIT 10`, [], (error, value) => {

            if (error) {
                console.error(error);
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setAuthor({ name: interaction.user.globalName })
                .setTitle("Leaderboard")
                .setDescription("Voici les " + value.length + " membres les plus actifs du serveur:");

            for (var i = 1; i <= value.length; i++) {
                embed.addFields({
                    name: "#" + i + " " + value[i - 1].userName,
                    value: "Level: " + value[i - 1].level + ", xp: " + value[i - 1].xp 
                })
            }

            interaction.reply({
                embeds: [embed],
            });
        })
	},
};