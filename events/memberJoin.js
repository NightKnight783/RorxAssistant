const { Events } = require("discord.js")

const channelId = "1162124995451949196"

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        
        const channel = member.client.channels.cache.find(channel => channel.id === channelId)
        
        let message = `
            Bienvenue <@${member.id}>! 
            - Pour télécharger le jeu c'est ici -> ⁠🎮-play-rorx
            - Pour t'inscrire au prochain tournoi -> ⁠🏆-tournaments
            - Pour connaitre les règles du jeu -> ⁠📕-tutorial
            - Pour toute question -> ⁠❓-questions
        `

        channel.send(message)

    }
}