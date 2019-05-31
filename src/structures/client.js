const CommandManager = require('./managers/command-manager');
const ProjectService = require('./services/projects-service');
const EmbedBuilder   = require('../util/embed-builder');
const { Client }     = require('eris');
const Logger         = require('./logger');

module.exports = class EikoClient extends Client
{
    /**
     * Creates a new instance of the AugustBoat client
     * @param {EikoClientOptions} options The client options
     */
    constructor(options = {})
    {
        super(options.token, options);

        this.manager   = new CommandManager(this);
        this.constants = require('../util/constants');
        this.logger    = new Logger();
        this.admins    = ['280158289667555328'];
        this.projects  = new ProjectService(this);
    }

    getEmbed()
    {
        return new EmbedBuilder()
            .setColor(this.constants.color);
    }

    async build()
    {
        this.manager.start();
        await super
            .connect()
            .then(() => this.logger.info('Now connecting via WebSocket'));
    }
};

/**
 * @typedef {{ token: string; } & import('eris').ClientOptions} EikoClientOptions
 */