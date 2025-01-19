const Report = require('../models/Report');
const axios = require('axios');

exports.saveAndForward = async (req, res) => {
  try {
    // Save in mongo
    const report = new Report(req.body);
    await report.save();

    // Forward to Backend 2
    try {
      await axios.post(process.env.BACKEND_2_URL + '/generate-pdf', {
        ...req.body,
        reportId: report._id
      });
    } catch (forwardError) {
      console.error('Error forwarding to Backend 2:', forwardError);
    }

    res.status(201).json({
      success: true,
      message: 'Report saved successfully',
      reportId: report._id
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};