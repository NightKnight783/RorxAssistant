const { Events, EmbedBuilder, Colors } = require("discord.js")

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {

        console.log(`${member.user.globalName} joined the server!`)
        
        const channelId = "851849903118090250"
        const channel = member.guild.channels.cache.get(channelId)

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({name: member.user.globalName})
            .setThumbnail("https://cdn.discordapp.com/avatars/" + member.user.id + '/' + member.user.avatar)
            .setTitle(`Bienvenue à toi futur stratège!`)
            .addFields({
                name: "Pour télécharger le jeu c'est ici:",
                value: "<#1170112026778021918>"
            }, {
                name: "Pour t'inscrire au prochain tournoi:",
                value: "⁠<#1170438859901898822>"
            }, {
                name: "Pour connaitre les règles du jeu:",
                value: "⁠<#1172447159451390002>"
            }, {
                name: "Pour toute question:",
                value: "<#851456552338325544>"
            })

        await channel.send({ embeds: [embed] });
    }
}