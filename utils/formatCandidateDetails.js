// Formating candidate full details.
const formatCandidateDetails = (details) => {
  return details.reduce((acc, detail) => {
    if (!acc.candidateId) {
      acc = {
        candidateId: detail.candidateId,
        firstName: detail.firstName,
        lastName: detail.lastName,
        email: detail.email,
        phoneNumber: detail.phoneNumber,
        resume: detail.resume,
        interviews: [],
      };
    }

    if (detail.interviewId) {
      acc.interviews.push({
        interviewId: detail.interviewId,
        interviewDate: detail.interviewDate,
        interviewTime: detail.interviewTime,
        interviewType: detail.interviewType,
        interviewResult: detail.interviewResult,
        schedule: detail.scheduleId
          ? {
              scheduleId: detail.scheduleId,
              scheduleDate: detail.scheduleDate,
              scheduleTime: detail.scheduleTime,
              room: detail.room,
            }
          : null,
        interviewer:
          detail.interviewerFirstName && detail.interviewerLastName
            ? {
                interviewerId: detail.interviewerId,
                firstName: detail.interviewerFirstName,
                lastName: detail.interviewerLastName,
              }
            : null,
      });
    }

    return acc;
  }, {});
};

module.exports = formatCandidateDetails;
