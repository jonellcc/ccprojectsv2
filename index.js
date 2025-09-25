const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const os = require("os")
const axios = require('axios');
const compression = require('compression');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
const routesPath = path.join(__dirname, 'routes');
const apiRoutes = [];
const requiredModules = new Set();
const server = require('http').createServer(app);
const io = socketIo(server);
app.use(compression());
app.use(cors());
const MASTER_SECRET = "jonell10";
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let limiter;
const resetLimiter = () => {
	limiter = rateLimit({
		windowMs: 60 * 1000,
		max: 10,
		handler: (req, res) => {
			res.status(429).sendFile(path.join(__dirname, 'public', 'detected.html'));
		}
	});
};

resetLimiter();
app.use((req, res, next) => {
	const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(`Request from IP: ${clientIp}, URL: ${req.originalUrl}`);
	next();
}, limiter);

let requestCount = 0;
const requestsFilePath = path.join(__dirname, 'requests.txt');
if (fs.existsSync(requestsFilePath)) {
	const data = fs.readFileSync(requestsFilePath, 'utf8');
	const requestObj = JSON.parse(data);
	requestCount = requestObj.count || 0;
}
app.use((req, res, next) => {
	requestCount++;
	fs.writeFile(requestsFilePath, JSON.stringify({ count: requestCount }), err => {
		if (err) console.error('Error writing to requests.txt:', err);
	});
	io.emit('updateRequestCount', requestCount);
	next();
});

/*await mongoose.connect(
  "mongodb+srv://higgenbottomjonell1:vkpQv8WfnpC5oki6@poge.zu6a3xz.mongodb.net/?retryWrites=true&w=majority&appName=Poge",
  {}
);

const requestSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});
const RequestCounter = mongoose.model('RequestCounter', requestSchema);

let requestDoc = await RequestCounter.findOne();
if (!requestDoc) {
  requestDoc = await RequestCounter.create({ count: 0 });
}

app.use(async (req, res, next) => {
  requestDoc.count++;
  await requestDoc.save();
  io.emit('updateRequestCount', requestDoc.count);
  next();
});*/
const installModule = (moduleName) => {
	return new Promise((resolve, reject) => {
		exec(`npm install ${moduleName}`, (error, stdout, stderr) => {
			if (error) reject(`Error installing module ${moduleName}: ${stderr}`);
			else resolve(`Module ${moduleName} installed successfully.`);
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
	apiRoutes.length = 0;
	const files = fs.readdirSync(routesPath);
	for (const file of files) {
		if (file.endsWith('.js')) {
			const apiPath = path.join(routesPath, file);
			delete require.cache[require.resolve(apiPath)];
			const api = require(apiPath);

			const moduleMatches = api.toString().match(/require\(['"](.+?)['"]\)/g) || [];
			moduleMatches.forEach(match => {
				const moduleName = match.match(/require\(['"](.+?)['"]\)/)[1];
				requiredModules.add(moduleName);
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
		}
	}

	await ensureModules(Array.from(requiredModules));
};

app.get('/requests', (req, res) => {
	fs.readFile(requestsFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading requests.txt:', err);
			res.status(500).json({ error: 'Error reading request count' });
		} else {
			const requestObj = JSON.parse(data);
			res.json({ request: requestObj.count });
		}
	});
});
/*app.get('/requests', async (req, res) => {
  try {
    const requestDoc = await RequestCounter.findOne();
    res.json({ request: requestDoc ? requestDoc.count : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching request count' });
  }
});*/
app.get("/stats", (req, res) => {
		const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2) + " GB"
		const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2) + " GB"
		const uptime = (os.uptime() / 3600).toFixed(2) + " hours"

		res.status(200).json({
			OS: os.type() + " " + os.release(),
			Architecture: os.arch(),
			"Storage Room": `Free: ${freeMem} / Total: ${totalMem}`,
			RAM: totalMem,
			"Uptime System": uptime,
			"Node.js Version": process.version,
			"System Status": res.statusCode
		})
	})
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "docs.html"));
});
	app.get("/system", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stats.html"));
});
const saveModule = async (url, name, secret) => {
	const response = await axios.get(url);
	const modulePath = path.join(routesPath, `${name}.js`);
	fs.writeFileSync(modulePath, response.data.replace('const secret = "";', `const secret = "${secret}";`));
};

const removeModule = (name) => {
	const modulePath = path.join(routesPath, `${name}.js`);
	if (fs.existsSync(modulePath)) fs.unlinkSync(modulePath);
	else throw new Error(`Module ${name} does not exist`);
};

app.get('/add/modules', async (req, res) => {
	const { url, name, secret } = req.query;
	if (!url || !name || !secret) return res.status(400).send('Missing required parameters');
	try {
		await saveModule(url, name, secret);
		await loadRoutes();
		res.send(`Module ${name} added and loaded successfully`);
	} catch (error) {
		res.status(500).send(`Error adding module ${name}: ${error.message}`);
	}
});

app.get('/remove/modules', async (req, res) => {
	const { name, secret } = req.query;
	if (!name || !secret) return res.status(400).send('Missing required parameters');
	if (secret !== MASTER_SECRET) return res.status(403).send('Forbidden: Incorrect secret key');
	try {
		removeModule(name);
		await loadRoutes();
		res.send(`Module ${name} removed successfully`);
	} catch (error) {
		res.status(500).send(`Error removing module ${name}: ${error.message}`);
	}
});

app.get('/shell', (req, res) => {
	const { command, secret } = req.query;
	if (!command || secret !== MASTER_SECRET) return res.status(403).send('Forbidden: Incorrect secret key or missing command');
	exec(command, (error, stdout, stderr) => {
		if (error) return res.status(500).send(`Error: ${error.message}`);
		if (stderr) return res.status(500).send(`Stderr: ${stderr}`);
		res.send(`Output: ${stdout}`);
	});
});

app.get('/routes', (req, res) => {
	const { name, secret } = req.query;
	if (secret !== MASTER_SECRET) return res.status(403).json({ error: 'Forbidden: Incorrect secret key' });
	const routeFilePath = path.join(routesPath, `${name}.js`);
	if (!fs.existsSync(routeFilePath)) return res.status(404).json({ error: 'Route not found' });
	const code = fs.readFileSync(routeFilePath, 'utf8');
	res.json({ code });
});

const startServer = async () => {
	await loadRoutes();
	app.get('/jonellmagallanes', (req, res) => res.json(apiRoutes));
	app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

	function startBot() {
		const child = spawn("node", ["--trace-warnings", "--async-stack-traces", ""], {
			cwd: __dirname,
			stdio: "inherit",
			shell: true
		});
		child.on("close", (codeExit) => {
			console.log(`Bot process exited with code: ${codeExit}`);
			if (codeExit !== 0) setTimeout(startBot, 3000);
		});
		child.on("error", (error) => console.error(`An error occurred starting the bot: ${error}`));
	}
	
	startBot();
	app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
};

startServer().catch(error => console.error('Error during server setup:', error));

// Add this at the end of the file
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Keep the server running
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception thrown:', error);
	// Keep the server running
});
