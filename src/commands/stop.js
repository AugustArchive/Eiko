const Command = require('../structures/command');

module.exports = class StopCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'stop',
            description: 'Stops a project',
            usage: '<project>',
            aliases: ['sudoku']
        });
    }

    /**
     * Runs the `restart` command
     * @param {import('eris').Message} message The command message
     * @param {string[]} args The command arguments
     */
    async run(message, args)
    {
        if (!args[0]) return message.channel.createMessage(':x: **|** Missing `<project>` argument!');

        const project = this.client.projects.projects.get(args[0]);
        if (!project) return message.channel.createMessage(':x: **|** No project found!');

        const proc = project.stop();
        project.setStatus('offline');
        return msg.channel.createMessage({
            embed: this
                .client
                .embed
                .setTitle(`Project ${project.name} Restarted!`)
                .setDescription(`
                    \`\`\`ini
                    [ERROR]: ${proc.error.message} ${proc.error.code}

                    [STDERR]:
                    ${proc.stderr}

                    [STDOUT]:
                    ${proc.stdout}
                `)
                .build()
        });
    }
};