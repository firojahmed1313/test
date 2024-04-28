const welfareHomeChildrenValidation = require("../validation/welfareHomeChildrenValidation");
const welfareHomeChildrenModel = require("../../../modals/WelfareHomeChildren");

const createWHFC = async (req, res) => {
  try {
    try {
      await welfareHomeChildrenValidation.validateAsync(req.body);
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: `vaidation errror`,
        error: error.message,
      });
    }

    const currentDate = new Date(),
      currentYear = currentDate.getFullYear();

    const {
      project_title, // required from the user
      general_information, // all the fields shall be required from user side
      mailing_list, // some fields shall be provided from the user side rest we make ourselves
      key_information, // all
      present_situation_of_inmates,
      focus_areas_in_present_year,
      solution_analysis_logical_framework,
      staff,
      sustainability,
      monitoring_and_evaluation,
      budget,
    } = req.body;
    const mailingList = {
      ...mailing_list,
      president_of_the_society: {
        ...mailing_list.president_of_the_society,
        agree: true, 
        date: currentDate,
      },
      project_in_charge: {
        ...mailing_list.project_in_charge,
        ref: req.user._id,
        date: currentDate,
        agree: true , 
      },
      provincial_superior: {
        ...mailing_list.provincial_superior,
        ref: req.user.reviewer,
      },
    };
    console.log(mailingList);
    // create regex to get the fo
    const projectCodeRegex = RegExp(`^WF${currentYear}`);
    // find one from the decreasing indexed string, the one that stays at top
    const lastCode = await welfareHomeChildrenModel.findOne(
      {
        project_number: { $regex: projectCodeRegex },
      },
      {
        _id: 0,
        project_number: 1,
      }
    );

    console.log(lastCode);

    let projectCode = `WF${currentYear}`;

    if (lastCode == null) {
      projectCode = `${projectCode}0`;
    } else {
      console.log(`${lastCode}`.substring(6));
      projectCode = `${projectCode}${parseInt(`${lastCode.project_number}`.substring(6) ?? '0') + 1}`;
    }

    // at some later dates we need to fetch both approvers from the database and add them manually for the purpose
    // the two are Sister Nirmala and Samuel Imbach
    // we shall send a request to the both approvers
    await welfareHomeChildrenModel.create({
      mailing_list:  mailingList,
      present_project_year: currentYear,
      project_number: projectCode,
      project_title,
      general_information,
      key_information,
      present_situation_of_inmates,
      focus_areas_in_present_year,
      solution_analysis_logical_framework,
      staff,
      sustainability,
      monitoring_and_evaluation,
      budget,
    });

    return res.status(200).json({
      success: true,
      msg: "successfull submission",
    });
    // what we need to generate from our side
    // ref shall be one of those
    // the main data to be generated
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Unexpected error creating the fields",
      error: error.message,
    });
  }
};

module.exports = createWHFC;
