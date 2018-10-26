'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');

const STATIC_PATH = "static";

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
});


const init = async () => {
    await server.register([Vision]);

    server.views({
        engines: { 
            html: Handlebars 
        },
        path: Path.join(__dirname, 'templates')
    });

    await server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'GET',
            path: '/',
            handler: {
                view: 'index.html'
            }
        }
    ]);
    
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();