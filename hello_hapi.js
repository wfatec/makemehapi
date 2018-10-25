'use strict';

const Hapi = require('hapi');
const server = Hapi.server({
    host: 'localhost',
    port: Number(process.env.argv[2]) || 8080,
});


const init = async () => {
    await server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Hello hapi';
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