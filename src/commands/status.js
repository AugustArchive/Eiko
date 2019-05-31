const Command = require('../structures/command');

module.exports = class StatusCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'status',
            description: 'Views all status\' of all projects',
            usage: '[status]',
            aliases: ['dashboard']
        });

        this.status = {
            online: 'All systems operational',
            dnd: 'Maintenance occuring, please stand and hold all decks!',
            offline: '{{project}} is now offline!'
        };
    }

    /**
     * Runs the `debug` command
     * @param {import('eris').Message} msg The message
     * @param {string[]} args The command arguments
     */
    async run(msg, args)
    {
        /** @type {Object<string, import('../structures/project')>} */
        const owo = {};

        if (!args[0]) {
            this.client.projects.projects.forEach((proj) => {
                if (!(proj.name in owo)) owo[proj.name] = proj;
            });

            const embed = this
                .client
                .embed
                .setTitle('Projects Avaliable');

            for (const proj in owo) embed.addField(`${owo[proj].getStatusBubble()} ${owo[proj].name}`, owo[proj].description, true);

            return msg
                .channel
                .createMessage({
                    embed: embed.build()
                });
        }

        const project = this.client.projects.projects.get(args[0]);
        if (!args[1]) return msg.channel.createMessage(`:x: **|** Unable to set the project \`${proj.name}\`'s status bubble without one!`);
        if (!['online', 'dnd', 'offline'].includes(args[1])) return msg.channel.createMessage(`:x: **|** Invalid status type. (\`online\`, \`dnd\`, \`offline\`)`);
        project.setStatus(args[1]);

        switch (args[1])
        {
            case "online": {
                msg.channel.createMessage(`:pencil: **|** Now starting ${project.name}`);
                const pro = project.start();
                if (pro.error) return msg.channel.createMessage(`:x: **|** ABORT! Unable to start project: \`\`\`\n${pro.stderr}\`\`\``);
            }

            case "dnd": {
                return msg.channel.createMessage('Project maintenance is coming soon, I hope...');
            }

            case "offline": {
                msg.channel.createMessage(`:pencil: **|** Stopping ${project.name}...`);
                const p = project.stop();
                if (p.error) return msg.channel.createMessage(`:x: **|** ABORT! Unable to stop project: \`\`\`\n${p.stderr}\`\`\``);
            }
        }

        return msg.channel.createMessage(`:ok_hand: **|** ${project.name} is now ${args[1]}! (${this.status[args[1]].replace('{{project}}', project.name)})`);
    }
};