const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const os = require("os");
const axios = require('axios');
const compression = require('compression');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;
const server = require('http').createServer(app);
const io = socketIo(server);

const routesPath = path.join(__dirname, 'routes');
const requestsFilePath = path.join(__dirname, 'requests.txt');
const apiRoutes = [];
const requiredModules = new Set();
const MASTER_SECRET = "jonell10";

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    handler: (req, res) => {
        res.status(429).sendFile(path.join(__dirname, 'public', 'detected.html'));
    }
});

app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`IP: ${clientIp} | ${req.method} ${req.originalUrl}`);
    next();
}, limiter);

let requestCount = 0;
if (fs.existsSync(requestsFilePath)) {
    try {
        const data = fs.readFileSync(requestsFilePath, 'utf8');
        requestCount = JSON.parse(data).count || 0;
    } catch (e) {
        requestCount = 0;
    }
}

app.use((req, res, next) => {
    requestCount++;
    fs.writeFile(requestsFilePath, JSON.stringify({ count: requestCount }), err => {
        if (err) console.error(err);
    });
    io.emit('updateRequestCount', requestCount);
    next();
});

const installModule = (moduleName) => {
    return new Promise((resolve, reject) => {
        exec(`npm install ${moduleName}`, (error, stdout, stderr) => {
            if (error) reject(stderr);
            else resolve(stdout);
        });
    });
};

const ensureModules = async (moduleNames) => {
    for (const moduleName of moduleNames) {
        try {
            require.resolve(moduleName);
        } catch (e) {
            await installModule(moduleName);
        }
    }
};

const loadRoutes = async () => {
    if (!fs.existsSync(routesPath)) fs.mkdirSync(routesPath);
    apiRoutes.length = 0;
    const files = fs.readdirSync(routesPath);
    for (const file of files) {
        if (file.endsWith('.js')) {
            try {
                const apiPath = path.join(routesPath, file);
                delete require.cache[require.resolve(apiPath)];
                const api = require(apiPath);

                const moduleMatches = api.toString().match(/require\(['"](.+?)['"]\)/g) || [];
                moduleMatches.forEach(match => {
                    const moduleName = match.match(/require\(['"](.+?)['"]\)/)[1];
                    if (!moduleName.startsWith('.') && !moduleName.startsWith('/')) {
                        requiredModules.add(moduleName);
                    }
                });

                const method = api.routes.method.toLowerCase();
                apiRoutes.push({
                    name: api.routes.name,
                    desc: api.routes.desc,
                    usages: api.routes.usages,
                    method: api.routes.method,
                    category: api.routes.category,
                    query: api.routes.query
                });

                app[method](api.routes.usages, api.onAPI);
            } catch (err) {
                console.error(`Failed to load route ${file}:`, err);
            }
        }
    }
    await ensureModules(Array.from(requiredModules));
};

app.get('/requests', (req, res) => {
    res.json({ request: requestCount });
});

app.get("/stats", (req, res) => {
    res.json({
        OS: os.type() + " " + os.release(),
        Architecture: os.arch(),
        Storage: `Free: ${(os.freemem() / (1024 ** 3)).toFixed(2)}GB / Total: ${(os.totalmem() / (1024 ** 3)).toFixed(2)}GB`,
        Uptime: (os.uptime() / 3600).toFixed(2) + " hours",
        NodeVersion: process.version
    });
});

app.get("/docs", (req, res) => res.sendFile(path.join(__dirname, "public", "docs.html")));
app.get("/system", (req, res) => res.sendFile(path.join(__dirname, "public", "stats.html")));

app.get('/add/modules', async (req, res) => {
    const { url, name, secret } = req.query;
    if (!url || !name || !secret) return res.status(400).send('Missing params');
    try {
        const response = await axios.get(url);
        const modulePath = path.join(routesPath, `${name}.js`);
        fs.writeFileSync(modulePath, response.data.replace('const secret = "";', `const secret = "${secret}";`));
        await loadRoutes();
        res.send(`Module ${name} added`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/remove/modules', async (req, res) => {
    const { name, secret } = req.query;
    if (secret !== MASTER_SECRET) return res.status(403).send('Forbidden');
    try {
        const modulePath = path.join(routesPath, `${name}.js`);
        if (fs.existsSync(modulePath)) fs.unlinkSync(modulePath);
        await loadRoutes();
        res.send(`Module ${name} removed`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/shell', (req, res) => {
    const { command, secret } = req.query;
    if (!command || secret !== MASTER_SECRET) return res.status(403).send('Forbidden');
    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).send(error.message);
        res.send(stdout || stderr);
    });
});

app.get('/routes', (req, res) => {
    const { name, secret } = req.query;
    if (secret !== MASTER_SECRET) return res.status(403).send('Forbidden');
    const routeFilePath = path.join(routesPath, `${name}.js`);
    if (!fs.existsSync(routeFilePath)) return res.status(404).send('Not found');
    res.json({ code: fs.readFileSync(routeFilePath, 'utf8') });
});

const startServer = async () => {
    await loadRoutes();
    app.get('/jonellmagallanes', (req, res) => res.json(apiRoutes));
    app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

    const startBot = () => {
        const child = spawn("node", ["index.js"], {
            cwd: __dirname,
            stdio: "inherit",
            shell: true
        });
        child.on("close", (code) => {
            if (code !== 0) setTimeout(startBot, 3000);
        });
    };

    server.listen(port, () => {
        console.log(`Server on port ${port}`);
        startBot();
    });
};

startServer().catch(console.error);
