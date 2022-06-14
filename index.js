import fs from 'fs';
import path from 'path';
import http from 'http';
const HTML_TEMPLATE = './index_template.html';
const HTML_TO_DISPLAY = path.join(path.resolve(), 'index.html');

const isDir = (dirPath) => fs.lstatSync(dirPath).isDirectory();

http.createServer((req, res) => {
    const reqPath = path.join(path.resolve(), req.url);

    if (isDir(reqPath)) {
        const dirContent = fs.readdirSync(reqPath);
        resultHTML(displayDirContent(req.url, dirContent));
    } else {
        resultHTML(fs.readFileSync(reqPath, 'utf-8'));
    }


    const readStream = fs.createReadStream(HTML_TO_DISPLAY);
    res.writeHead(200, { 'Content-Type': 'text/html'});
    readStream.pipe(res);
}).listen(5555, 'localhost');

const displayDirContent = (currentPath, list) => {
    let htmlList = '';
    htmlList += '<ul>';
    htmlList += list.reduce((list, item) => list+=`<li><a href="${currentPath == '/' ? currentPath + item : currentPath + '/' + item}">${item}</a></li>`, '');
    htmlList += '</ul>';
    return htmlList;
};

const resultHTML = (toPresent) => {
    let template = fs.readFileSync(HTML_TEMPLATE, 'utf-8');
    template = template.replace('{{data}}', toPresent);
    fs.writeFileSync('./index.html', template);
};