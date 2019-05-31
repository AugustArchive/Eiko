require('dotenv').config({ path: '../.env' });
console.clear();

const Client = require('./structures/client');
const build  = require('./build');
const client = new Client({
    token: process.env.BOT_TOKEN,
    disableEveryone: true,
    getAllUsers: true
});

client
    .on('messageCreate', (msg) => client.manager.service.run(msg))
    .on('ready', () => {
        client.logger.info(`${client.user.username}#${client.user.discriminator} (${client.user.id}) has logged into Discord!`);
        client.editStatus('online', {
            name: 'osu!',
            type: 0
        });
    });

client.logger.info(`Starting release ${build.release}`);
client.build();