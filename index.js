import fs from 'fs';
import readline from 'readline';
import { Stream } from 'stream';
const TEST_FILE = './access_tmp.log';
//const TRUE_FILE = './access.log';
let IPs = process.argv.slice(2);
const newStream = fs.createReadStream(TEST_FILE, 'utf-8');
const outStream = new Stream();
const readLineFromStream = readline.createInterface(newStream, outStream);
const writeStreams = {};

if(IPs.length == 0) {
    IPs = ['89.123.1.41', '34.48.240.111'];
}

IPs.forEach((IP) => {
    writeStreams[IP] = fs.createWriteStream(`${IP}_requests.log`, {
        encoding: 'utf-8',
        flags: 'a'
    });

});

readLineFromStream.on('line', (line) => {
    if(line.length == 0) { return; }

    IPs.forEach((IP) => {
        if(line.indexOf(IP) !== -1) {
            writeStreams[IP].write(line + '\n');
        }
    });
});