import {
  fetchJobApplicationsForCandidateAction,
  fetchJobsForCandidateAction,
} from "@/actions";
import CandidateActivity from "@/components/candidate-activity";
import { currentUser } from "@clerk/nextjs/server";

const Activity = async () => {
  const user = await currentUser();
  const jobList = await fetchJobsForCandidateAction();
  const jobApplicants = await fetchJobApplicationsForCandidateAction(user?.id);

  return <CandidateActivity jobList={jobList} jobApplicants={jobApplicants} />;
};

export default Activity;
