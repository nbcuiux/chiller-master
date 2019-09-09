var path = require('path');

// The name of the theme directory
var themeName = "chiller-uat";

// The site url variable for wordpress
var siteUrl   = "http://localhost:8888/chiller_uat_wp/wordpress";

module.exports = {
    root: {
        src: path.join(__dirname, '../src'),
        dest: path.join(__dirname, '../wordpress/wp-content/themes/' + themeName)
    },
    watchableTasks: ['scripts', 'styles', 'iconfont', 'sprite'],
    tasks: {
        browserSync: {
            // Taking the options from: https://www.browsersync.io/docs/options/
            // Serve files from the app directory

            /*
            server: {
                baseDir: "."
            }
            */

            // Proxy through another webserver
            
            proxy: {
                target: siteUrl
            }
        },
        deploy: {
            dest: "~/wp-starter.deependmelbourne.com.au",
            host: "deepend@apache.deependmelbourne.com.au"
        },
        scripts: {
            src: 'scripts',
            dest: 'assets/js',
            input: ['main.js'],
            output: 'app.js',
            extensions: ['js']
        },
        styles: {
            src: 'styles',
            dest: 'assets/css',
            sources: [ 
                { input: 'styles.scss', output: 'styles.css'},
            ],
            extensions: ['scss','sass','css']
        },
        sprite: {
            src: 'images/',
            dest: 'assets/css/img/',
            cssDest: './src/styles',
            imgName: 'sprite.png',
            retinaImgName: 'sprite@2x.png',
            cssName: 'sprite.scss',
            extensions: ['png']
        },
        iconfont: {
            src: 'icons/',
            dest: 'assets/css/fonts/',
            template: 'icons/templates/webfont.template.css',
            cssDest: './src/styles',
            cssName: '_icons.scss',
            extensions: ['svg'],
            config: {
                fontName: 'icons', // required
                appendUnicode: true, // recommended option
                formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available
                timestamp: Math.round(Date.now()/1000), // recommended to get consistent builds when watching files
                normalize: true,
                fontHeight: 500
            }
        },
    }
};