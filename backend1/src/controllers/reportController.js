const Report = require('../models/Report');
const axios = require('axios');

exports.saveAndForward = async (req, res) => {
  try {
    // Save in mongo
    const report = new Report(req.body);
    await report.save();

    // Forward to Backend 2
    try {
      await axios.post('http://localhost:4002/api/generate-pdf', {
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

    const pdfUrl = `http://localhost:4002/downloads/${req.params.id}.pdf`;
    const pdfResponse = await axios({
      method: 'get',
      url: pdfUrl,
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${req.params.id}.pdf"`);

    // stream to the response
    pdfResponse.data.pipe(res);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        message: 'PDF not found or error accessing PDF'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error fetching PDF'
      });
    }
  }
};