const pkg = require('../../package.json');

const manifestInput = {
    manifest_version: 2,
    name: 'Hub Tab',
    version: pkg.version,

    icons: {
        '16': 'assets/icons/favicon-16.png',
        '32': 'assets/icons/favicon-32.png',
        '48': 'assets/icons/favicon-48.png',
        '128': 'assets/icons/favicon-128.png',
    },

    description: 'Sample description',
    homepage_url: 'https://github.com/pandelisz/hub-tab',
    short_name: 'Hub Tab',
    chrome_url_overrides: {
        newtab: 'newtab.html',
    },
    permissions: ['storage'],
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",

    '__chrome|firefox__author': 'pandelis',
    __firefox__applications: {
        gecko: { id: '{f5ac8157-f804-4b6a-816b-01fa66dffedb}' },
    },

    __chrome__minimum_chrome_version: '49',
    __opera__minimum_opera_version: '36',

    '__chrome|opera__options_page': 'options.html',

    options_ui: {
        page: 'options.html',
        open_in_tab: true,
        __chrome__chrome_style: false,
    },
};

module.exports = manifestInput;
