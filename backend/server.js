const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const frontendRoot = path.resolve(__dirname, '..', 'frontend')
const port = Number(process.env.PORT) || 3000
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
}

const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent(request.url.split('?')[0])
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1)
    const filePath = path.resolve(frontendRoot, relativePath)

    if (!filePath.startsWith(`${frontendRoot}${path.sep}`)) {
        response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
        response.end('Forbidden')
        return
    }

    fs.stat(filePath, (statError, stats) => {
        const resolvedPath = !statError && stats.isDirectory() ? path.join(filePath, 'index.html') : filePath
        fs.readFile(resolvedPath, (readError, content) => {
            if (readError) {
                response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
                response.end('Not found')
                return
            }

            response.writeHead(200, {
                'Content-Type': contentTypes[path.extname(resolvedPath)] || 'application/octet-stream',
            })
            response.end(content)
        })
    })
})

server.listen(port, () => {
    console.log(`KisanSetu frontend available at http://localhost:${port}`)
})
