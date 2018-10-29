'use strict';

const Hapi = require('hapi');
const Path = require('path');
const H2o2 = require('h2o2');

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
});


const init = async () => {
    await server.register([H2o2]);

    await server.route([
        // 创建一个简单的代理接口
        {
            method: 'GET',
            path: '/proxy',
            handler: {
                proxy: {
                    host: 'localhost',
                    port: '65535',
                    protocol: 'http'
                }
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