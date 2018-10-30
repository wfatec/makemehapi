'use strict';

const Hapi = require('hapi');
const Path = require('path');

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
});


const init = async () => {

    await server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'POST',
            path: '/upload',
            handler: (request, h) => {
                return new Promise((resolve, reject) => {
                    let body = '';
                    request.payload.file.on('data', (data) => {
                        body += data;
                    });
    
                    request.payload.file.on('end', () => {
                        let result = {
                            description: request.payload.description,
                            file: {
                                data: body,
                                filename: request.payload.file.hapi.filename,
                                headers: request.payload.file.hapi.headers
                            }
                        };
    
                        return resolve(JSON.stringify(result));
                    });
    
                    request.payload.file.on('error', (err) => {
                        return reject(err);
                    });
                })
                
            },
            config: {
                payload: {
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data'
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