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
            method: 'GET',
            path: '/chickens/{breed?}',
            handler: (request, h) => {
                return `You asked for the chicken ${request.params.breed}!`; 
            },
            config: {
                validate: {
                    params: {
                        breed: Joi.string().required()
                    }
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