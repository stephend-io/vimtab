import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
    name: 'vimTab',
    description: 'A new-tab app for vim motion controls to extend to new tabs',
    version: '1.0.0',
    manifest_version: 3,
    icons: {
        '16': 'img/logo-16.png',
        '32': 'img/logo-34.png',
        '48': 'img/logo-48.png',
        '128': 'img/logo-128.png',
    },
    action: {
        default_popup: 'popup.html',
        default_icon: 'img/logo-48.png',
    },
    options_page: 'options.html',
    chrome_url_overrides: {
        newtab: 'newtab.html',
    },
    web_accessible_resources: [
        {
            resources: [
                'img/logo-16.png',
                'img/logo-34.png',
                'img/logo-48.png',
                'img/logo-128.png',
            ],
            matches: [],
        },
    ],
    permissions: ['tabs', 'bookmarks', 'history'],
    host_permissions: ['https://*/*'],
})
