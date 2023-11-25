const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { Database } = require('sqlite3')

const getMedal = (i) => {
    switch(i) {
        case 1:
            return ":first_place: "
        case 2:
            return ":second_place: "
        case 3:
            return ":third_place: "
        default:
            return `#${i}`
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the 10 members with the most xp.'),
	async execute(interaction) {

        const author = {
            name: interaction.user.globalName,
            iconURL: "https://cdn.discordapp.com/avatars/" + interaction.user.id + '/' + interaction.user.avatar
        }
		
        const db = new Database("Database.sqlite")

        db.all(`SELECT * FROM members_xp ORDER BY level DESC, xp DESC LIMIT 10`, [], (error, value) => {

            if (error) {
                console.error(error);
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setAuthor(author)
                .setTitle("Leaderboard")
                .setDescription("Voici les " + value.length + " membres les plus actifs du serveur:");

            for (var i = 1; i <= value.length; i++) {
                embed.addFields({
                    name: getMedal(i) + " " + value[i - 1].userName,
                    value: "Niveau: " + value[i - 1].level + " | Xp: " + value[i - 1].xp + ""
                })
            }

            interaction.reply({
                embeds: [embed],
            });
        })
	},
};