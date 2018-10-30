'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Joi = require('joi');

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
});


const init = async () => {

    await server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'POST',
            path: '/login',
            handler: (request, h) => {
                return `login successful`; 
            },
            config: {
                validate: {
                    payload: Joi.object({
                        isGuest: Joi.boolean().required(),
                        username: Joi.string().when('isGuest', { is: false, then: Joi.required() }),
                        password: Joi.string().alphanum(),
                        accessToken: Joi.string().alphanum(),
                    }).options({ allowUnknown: true }).without('password', 'accessToken')
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