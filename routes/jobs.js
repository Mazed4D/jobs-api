const { Router } = require('express');
const router = Router();

const {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob,
} = require('../controllers/jobs');

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
