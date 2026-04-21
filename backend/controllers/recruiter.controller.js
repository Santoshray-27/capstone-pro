/**
 * Recruiter Controller
 * Recruiter-specific features: job management, candidate search
 */

const Job = require('../models/Job.model');
const User = require('../models/User.model');
const Resume = require('../models/Resume.model');

// @route  GET /api/recruiter/dashboard
const getRecruiterDashboard = async (req, res, next) => {
  try {
    const [myJobs, totalApplications, recentCandidates] = await Promise.all([
      Job.find({ postedBy: req.user._id, isActive: true }).sort({ createdAt: -1 }).limit(10),
      Job.aggregate([
        { $match: { postedBy: req.user._id } },
        { $group: { _id: null, total: { $sum: '$applicationCount' } } }
      ]),
      User.find({ role: 'jobseeker', isActive: true })
        .sort({ 'stats.lastActive': -1 })
        .limit(10)
        .select('name profile.skills profile.location stats.averageAtsScore createdAt')
    ]);

    res.json({
      success: true,
      dashboard: {
        myJobs,
        totalJobs: myJobs.length,
        totalApplications: totalApplications[0]?.total || 0,
        recentCandidates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/recruiter/candidates
const searchCandidates = async (req, res, next) => {
  try {
    const { skills, location, experience, page = 1, limit = 10 } = req.query;
    const query = { role: 'jobseeker', isActive: true };

    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query['profile.skills'] = { $in: skillArray };
    }
    if (location) query['profile.location'] = new RegExp(location, 'i');

    const candidates = await User.find(query)
      .sort({ 'stats.averageAtsScore': -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('name email profile.skills profile.location profile.experience stats');

    const total = await User.countDocuments(query);

    res.json({ success: true, total, candidates });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecruiterDashboard, searchCandidates };
