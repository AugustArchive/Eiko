const { stripIndents } = require('common-tags');
const { Collection }   = require('eris');

module.exports = class CommandService
{
    /**
     * Creates a new instance of the command service instance
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        this.client     = client;
        /** @type {Collection<Collection<number>>} */
        this.ratelimits = new Collection();
    }

    /**
     * Run the command service
     * @param {import('eris').Message} msg The message
     */
    async run(msg)
    {
        if (msg.author.bot) return;

        let prefix = null;
        const mention = new RegExp(`^<@!?${this.client.user.id}> `).exec(msg.content);
        const prefixes = [`${mention}`, process.env.BOT_PREFIX];

        for (const pre of prefixes) if (msg.content.startsWith(pre)) prefix = pre;
        if (!prefix) return;
        if (!this.client.admins.includes(msg.author.id)) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift();
        const command = this.client.manager.commands.filter(c => c.command === commandName || c.aliases.includes(commandName));

        if (command.length > 0)
        {
            const cmd = command[0];
            if (!this.ratelimits.has(cmd.command)) this.ratelimits.set(cmd.command, new Collection());
            const now = Date.now();
            const timestamps = this.ratelimits.get(cmd.command);
            const throttle = cmd.cooldown * 1000;

            if (!timestamps.has(msg.author.id)) {
                timestamps.set(msg.author.id, now);
                setTimeout(() => timestamps.delete(msg.author.id), throttle);
            } else {
                const time = timestamps.get(msg.author.id);
                if (now < time) {
                    const left = (time - now) / 1000;

                    return msg.channel.createMessage({
                        embed: this
                            .client
                            .embed
                            .setDescription(`**${msg.author.username}, the command \`${cmd.command}\` is currently on cooldown for another ${left > 1? `${left.toFixed()} seconds`: `${left.toFixed()} second`}.**`)
                            .build()
                    });
                }

                timestamps.set(msg.author.id, now);
                setTimeout(() => timestamps.delete(msg.author.id), throttle);
            }

            try {
                await cmd.run(msg, args);
            } catch(ex) {
                return msg.channel.createMessage({
                    embed: this
                        .client
                        .embed
                        .setTitle(`Command ${cmd.command} failed`)
                        .setDescription(stripIndents`
                            \`\`\`js
                            ${ex.stack.split('\n')[0]}
                            ${ex.stack.split('\n')[2]}
                            \`\`\`
                        `)
                        .build()
                });
            }
        }
    }
};