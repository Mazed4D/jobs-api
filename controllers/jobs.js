const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
	try {
		const job = await Job.findOne({
			_id: req.params.id,
			createdBy: req.user.userId,
		});
		res.status(StatusCodes.OK).json(job);
	} catch (error) {
		throw new NotFoundError(`Job with id of ${req.params.id} not found`);
	}
};
const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);

	res.status(StatusCodes.CREATED).json(job);
};
const updateJob = async (req, res) => {
	try {
		if (req.body.company === '' || req.body.position === '') {
			throw new BadRequestError('Missing company or position');
		}
		const job = await Job.findOneAndUpdate(
			{
				_id: req.params.id,
				createdBy: req.user.userId,
			},
			{ company: req.body.company, position: req.body.position },
			{
				new: true,
				runValidators: true,
			}
		);
		res.status(StatusCodes.OK).json(job);
	} catch (error) {
		throw new NotFoundError(`Job with id of ${req.params.id} not found`);
	}
};
const deleteJob = async (req, res) => {
	const job = await Job.findOneAndRemove({
		_id: req.params.id,
		createdBy: req.user.userId,
	});
	if (!job) {
		throw new NotFoundError(`Job with id of ${req.params.id} not found`);
	}
	res.status(StatusCodes.OK).json(job);
};

module.exports = {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob,
};
