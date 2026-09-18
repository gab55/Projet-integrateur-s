const Platform = {
    OS: 'ios',
    select: (config) => {
        if (config && 'ios' in config) return config.ios;
        return config ? config.default : undefined;
    },
    Version: 1,
    isTesting: true,
};

module.exports = Platform;
