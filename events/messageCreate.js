const { EmbedBuilder, Colors, Events } = require('discord.js');
const { Database } = require('sqlite3')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.author.globalName) return

        const db = new Database("Database.sqlite")

        db.serialize(() => {
                
            db.get(`
                SELECT * FROM members_xp WHERE userId = ?
            `, [message.author.id], (error, value) => {

                if (error) {
                    console.error(error);
                    return;
                }

                if (!value) {
                    //Create user in Database if not exist
                    db.run(`
                        INSERT into members_xp (userId, userName, time) values (?, ?, ?)
                    `, [message.author.id, message.author.globalName, Date.now()]);
                }
                else {

                    //Si le dernier message envoyé date de moins d'une minute on ignore
                    if (Date.now() - (new Date(value.time)).getTime() < 15 * 1000) return

                    let level = parseInt(value.level)
                    let xp = parseInt(value.xp) + Math.floor(Math.random() * 10) + 20;

                    if ((level) * 500 <= xp) {
                        xp -= ((level) * 500)
                        level ++;

                        const author = {
                            name: message.author.globalName,
                            iconURL: "https://cdn.discordapp.com/avatars/" + message.author.id + '/' + message.author.avatar
                        }

                        const embed = new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setAuthor(author)
                            .setTitle(`Félicitation ${message.author.globalName}!`)
                            .setDescription(`Vous venez d'atteindre le niveau ${level}!`)

                        message.channel.send({ embeds: [embed] });
                    }

                    //Update user xp
                    db.run(`
                        UPDATE members_xp SET xp = ?, level = ?, userName = ?, time = ? WHERE userId = ?
                    `, [xp, level, message.author.globalName, Date.now(), value.userId])
                } 

                db.close()

                //Exemple de DELETE
                //db.rub(`SELECT * FROM memrbs_xp ORDER_BY level, xp DESC LIMIT 10`)
                //db.run(`DELETE FROM members_xp WHERE userId = ?`, [value.userId])
            })
        });
    }
}