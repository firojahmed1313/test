const HIVAffectedOutreach = require("../../../modals/HIVAffectedOutreach");

const editHIVReviewer = async (req, res) => {
  try {
    const reviewerId = req.user._id ; 
    //fields we require from the request body
    const { comment, agree, project_number } = req.body;

    if (!comment || agree === undefined || project_number === null) {
      return res.status(400).json({
        success: false,
        msg: "send all fields",
      });
    }

    const updatedData = await HIVAffectedOutreach.findOneAndUpdate(
      {project_number},
      {
        $set: {
          "mailing_list.provincial_superior": {
            ref: reviewerId,
            agree,
            comment,
            date: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(400).json({
        msg: "review unsuccessful",
        sucess: false,
      });
    }
    return res.status(200).json({
      msg: "successfully reviewed the application waiting for approval",
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "review unsuccessful",
      error: error.message,
      sucess: false,
    });
  }
};

module.exports = editHIVReviewer ; 
