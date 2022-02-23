require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// security packages
const helmer = require('helment');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// connectDB
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(helmet());
app.use(corse());
app.use(xss());
app.use(rateLimit({ windowsMs: 60 * 1000, max: 60 }));

// extra packages
const authMiddleware = require('./middleware/authentication');

app.get('/', (req, res) => {
	res.send('jobs api');
});
// routes
app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/jobs/', authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();