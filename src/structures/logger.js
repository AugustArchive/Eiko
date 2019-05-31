const enabled   = (process.env.FORCE_COLOR || process.platform === 'win32' || (process.stdout.isTTY && process.env.TERM && process.env.TERM !== 'dumb'));
const supported = process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color';

module.exports = class Logger
{
    /**
     * Creates a new instance of the Logger instance
     */
    constructor()
    {
        this.colors = {
            reset: init(0, 0),
            bold: rawInit("\x1b[1m", "\x1b[22m", /\x1b\[22m/g, "\x1b[22m\x1b[1m"),
            dim: rawInit("\x1b[2m", "\x1b[22m", /\x1b\[22m/g, "\x1b[22m\x1b[2m"),
            italic: init(3, 23),
            underline: init(4, 24),
            inverse: init(7, 27),
            hidden: init(8, 28),
            strikethrough: init(9, 29),
            black: init(30, 39),
            red: init(31, 39),
            green: init(32, 39),
            yellow: init(33, 39),
            blue: init(34, 39),
            magenta: init(35, 39),
            cyan: init(36, 39),
            white: init(37, 39),
            gray: init(90, 39),
            bgBlack: init(40, 49),
            bgRed: init(41, 49),
            bgGreen: init(42, 49),
            bgYellow: init(43, 49),
            bgBlue: init(44, 49),
            bgMagenta: init(45, 49),
            bgCyan: init(46, 49),
            bgWhite: init(47, 49),
            blackBright: init(90, 39),
            redBright: init(91, 39),
            greenBright: init(92, 39),
            yellowBright: init(93, 39),
            blueBright: init(94, 39),
            magentaBright: init(95, 39),
            cyanBright: init(96, 39),
            whiteBright: init(97, 39),
            bgBlackBright: init(100, 49),
            bgRedBright: init(101, 49),
            bgGreenBright: init(102, 49),
            bgYellowBright: init(103, 49),
            bgBlueBright: init(104, 49),
            bgMagentaBright: init(105, 49),
            bgCyanBright: init(106, 49),
            bgWhiteBright: init(107, 49)
        };
        this.symbols = {
            info: supported? this.colors.blue('ℹ'): this.colors.blue('i'),
            warning: supported? colors.yellow('⚠'): this.colors.yellow('‼'),
            error: supported? this.colors.red('✖'): this.colors.red('×')
        };
    }

    /**
     * Logs anything informational
     * @param {string} message The message to print
     */
    info(message)
    {
        process.stdout.write(`${this.symbols.info} ${this.colors.white(message)}\n`);
    }

    /**
     * Logs anything that is warningful
     * @param {string} message The message to print
     */
    warn(message)
    {
        process.stdout.write(`${this.symbols.warning} ${this.colors.white(message)}\n`);
    }

    /**
     * Logs anything that is an ERROR
     * @param {string} message The message to print
     */
    error(message)
    {
        process.stdout.write(`${this.symbols.error} ${this.colors.white(message)}\n`);
    }
};

/**
 * Raw initial of converting terminal colours
 * @param {string} open The open key 
 * @param {string} close The close key 
 * @param {RegExp} search The search regex 
 * @param {string} replace The replace value
 * @returns {(s: string) => string} Callback owo
 */
const rawInit = (open, close, search, replace) => s => enabled? open + (~(s += "").indexOf(close, 4)? s.replace(search, replace): s) + close: s;

/**
 * Initialize the colors
 * @param {number} open The opening number
 * @param {number} close The closing nUMbEr
 */
const init = (open, close) => rawInit(`\x1b[${open}m`, `\x1b[${close}m`, new RegExp(`\\x1b\\[${close}m`, 'g'), `\x1b[${open}m`);