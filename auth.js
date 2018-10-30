'use strict';

const Hapi = require('hapi');
const Path = require('path');
const HapiAuthBasic = require('hapi-auth-basic');

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
});

const validate = async (request, username, password, h) => {

    const isValid = username === 'hapi' && password === 'auth';
    const credentials = { name: username };

    return {
        isValid,
        credentials,
    }


}

const init = async () => {

    await server.register([HapiAuthBasic]);

    server.auth.strategy('simple', 'basic', { validate });
    server.auth.default('simple');

    server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'welcome';
            },
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