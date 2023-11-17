const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { Database } = require('sqlite3')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Display your current level and xp.'),
	async execute(interaction) {
		
        const db = new Database("Database.sqlite")

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
                        .setAuthor({ name: interaction.user.username })
                        .setTitle("Status")
                        .setDescription("Level: 1\nxp: 0\nXp requis avant level up: 500");

                    await interaction.reply(
                        {
                            embeds: [embed],
                        });
                }
                else {
                    const embed = new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setAuthor({ name: interaction.user.globalName })
                    .setTitle("Status")
                    .setDescription(`Level: ${value.level}\nxp: ${value.xp}\nXp requis avant level up: ${(value.level * 500) - value.xp}`);

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