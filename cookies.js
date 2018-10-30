'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Boom = require('boom');

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
});


const init = async () => {

    await server.state('session', {
        path: '/',
        encoding: 'base64json',
        ttl: 10,
        domain: 'localhost',
        isSameSite: false,
        isSecure: false,
        isHttpOnly: false
    });

    await server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'GET',
            path: '/set-cookie',
            handler: (request, h) => {
                return h.response({
                    message : 'success'
                }).state('session', { key : 'makemehapi' });
            },
            config: {
                state: {
                    parse: true,
                    failAction: 'log'
                }
            }
        }, {
            method: 'GET',
            path: '/check-cookie',
            handler: (request, h) => {
                var session = request.state.session;
                var result;
        
                if (session) {
                    result = { user : 'hapi' };
                } else {
                    result = Boom.unauthorized('Missing authentication');
                }
        
                return result;
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