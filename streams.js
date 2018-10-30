'use strict';

const Fs = require('fs');
const Hapi = require('hapi');
const Path = require('path');
const Rot13 = require('rot13-transform');

const server = Hapi.server({
    host: 'localhost',
    port: Number(process.argv[2]) || 8080,
});


const init = async () => {

    await server.route([
        // 创建一个简单的 hello hapi 接口
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                const thisfile = Fs.createReadStream(Path.join(__dirname, 'input.txt'));
                return thisfile.pipe(Rot13()); 
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