const EI = require("../modals/EducationIndividual");



const editEIapprover = async (req, res) => {
  try {
    const {
      projectID,
      comment_box_project_coordinator,
      comment_box_project_coordinator_swz,
      project_coordinator_agree,
      project_coordinator_agree_swz,
      amount_approved, 
    } = req.body;
    if (
      !projectID 
    ) {
      return res.json({ success: false, msg: "send all fields" });
    }

    const editedEI = await EI.findByIdAndUpdate(
      projectID,
      {
        comment_box_project_coordinator: comment_box_project_coordinator,
        comment_box_project_coordinator_swz: comment_box_project_coordinator_swz,
        project_coordinator_agree_swz: project_coordinator_agree_swz,
        project_coordinator_agree: project_coordinator_agree,
        amount_approved : amount_approved , 
        
      },
      { new: true }
    );

    if (!editedEI) {
      return res.json({ success: false, msg: "updation failed" });
    }
    return res.json({ success: true, data: editedEI });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};
module.exports = editEIapprover;
