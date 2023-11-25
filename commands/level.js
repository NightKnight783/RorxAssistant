const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { Database } = require('sqlite3')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Display your current level and xp.'),
	async execute(interaction) {
		
        const db = new Database("Database.sqlite")

        const author = {
            name: interaction.user.globalName,
            iconURL: "https://cdn.discordapp.com/avatars/" + interaction.user.id + '/' + interaction.user.avatar
        }

        db.serialize(() => {
                
            db.get(`
                SELECT * FROM members_xp WHERE userId = ?
            `, [interaction.user.id], async (error, value) => {

                if (error) {
                    console.error(error);
                    return;
                }

                if (!value) {
                    //Create user in Database if not exist
                    db.run(`
                        INSERT into members_xp (userId, userName, time) values (?, ?, ?)
                    `, [interaction.user.id, interaction.user.globalName, Date.now()]);

                    const embed = new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setAuthor(author)
                        .setTitle("Vous êtes actuellement Level: 1")
                        .setDescription("Vous possedez 0 xp\nIl vous en manque donc 500 avant de monter de niveau!");

                    await interaction.reply(
                        {
                            embeds: [embed],
                        });
                }
                else {
                    const embed = new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setAuthor(author)
                    .setTitle(`Vous êtes actuellement Level: ${value.level}`)
                    .setDescription(`Vous possedez ${value.xp} xp\nIl vous en manque donc ${(value.level * 500) - value.xp} avant de monter de niveau!`);

                await interaction.reply(
                    {
                        embeds: [embed],
                    });
                }

                db.close()
            })
        });
	},
};