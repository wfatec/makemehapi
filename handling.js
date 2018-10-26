'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');

const STATIC_PATH = "static";

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'static')
        }
    }
});


const init = async () => {
    await server.register([Inert]);

    await server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'GET',
            path: '/',
            handler: {
                file: 'index.html'
            }
        }, {
            method: 'GET',
            path: '/{name}',
            handler: (request, h) => {
                return `Hello ${request.params.name}`;
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