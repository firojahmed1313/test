const welfareHomeChildrenModel = require("../../../modals/WelfareHomeChildren");

// this time find all where applicant is the applicant

const getAllWHFCApprover = async (req, res) => {
  try {
    // validitiy of user will be checked from the token itself
    // you have to querry by project_in_charge.ref

    const approverId = req.user._id;

    // find by applicant
    const allWHFCProject = await welfareHomeChildrenModel
      .find({
        // don't need this complicated querry
        // "mailing_list.project_coordinators.ref" : approverId,
      })
      .populate("mailing_list.project_in_charge.ref")
      .populate("mailing_list.provincial_superior.ref")
      .populate("mailing_list.project_coordinators.ref");
    // I am not sure if populating is required , if it will be I'll put it there

    if (!allWHFCProject) {
      return res.status(400).json({
        status: false,
        msg: `Unable to fetch any projects for the approver`,
      });
    }
    return res.status(200).json({
      status: true,
      msg: "successfully got all projects",
      data: allWHFCProject,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Cannot fetch any projects",
      error: error.message,
    });
  }
};

module.exports = getAllWHFCApprover;
