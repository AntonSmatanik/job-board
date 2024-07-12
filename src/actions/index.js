"use server";

import connectToDB from "@/database";
import Application from "@/models/applications";
import Feed from "@/models/feed";
import Job from "@/models/job";
import Profile from "@/models/profile";
import { revalidatePath } from "next/cache";

const stripe = require("stripe")(
  "sk_test_51HMZclB2gjTTt0Es0GGiMB44Vlrs8PfMkWcKlHfDyC8mlAdTLUWwDui4r5STCBZ6oulTRV6iofkZHLFeNK7Rmcuw00pljjY81h"
);

export const createProfileAction = async (formData, pathToRevalidate) => {
  await connectToDB();
  await Profile.create(formData);
  revalidatePath(pathToRevalidate);
};

export const fetchProfileAction = async (id) => {
  await connectToDB();
  const result = await Profile.findOne({ userId: id });

  return JSON.parse(JSON.stringify(result));
};

export const postNewJobAction = async (formData, pathToRevalidate) => {
  await connectToDB();
  await Job.create(formData);
  revalidatePath(pathToRevalidate);
};

export const fetchJobsForRecruiterAction = async (id) => {
  await connectToDB();
  const result = await Job.find({ recruiterId: id });

  return JSON.parse(JSON.stringify(result));
};

export const fetchJobsForCandidateAction = async (filterParams = {}) => {
  await connectToDB();

  const updatedParams = {};

  Object.keys(filterParams).forEach((filterKey) => {
    updatedParams[filterKey] = { $in: filterParams[filterKey].split(",") };
  });

  const result = await Job.find(
    filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {}
  );

  return JSON.parse(JSON.stringify(result));
};

export const fetchJobApplicationsForCandidateAction = async (candidateID) => {
  await connectToDB();
  const result = await Application.find({ candidateUserID: candidateID });

  return JSON.parse(JSON.stringify(result));
};

export const fetchJobApplicationsForRecruiterAction = async (recruiterID) => {
  await connectToDB();
  const result = await Application.find({ recruiterUserID: recruiterID });

  return JSON.parse(JSON.stringify(result));
};

export const createJobApplicationAction = async (data, pathToRevalidate) => {
  await connectToDB();
  await Application.create(data);
  revalidatePath(pathToRevalidate);
};

export const getCandidateDetailsByIDAction = async (currentCandidateID) => {
  await connectToDB();
  const result = await Profile.findOne({ userId: currentCandidateID });

  return JSON.parse(JSON.stringify(result));
};

export const updateJobApplicationAction = async (data, pathToRevalidate) => {
  await connectToDB();
  const {
    recruiterUserID,
    name,
    email,
    candidateUserID,
    status,
    jobID,
    _id,
    jobAppliedDate,
  } = data;

  await Application.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      recruiterUserID,
      name,
      email,
      candidateUserID,
      status,
      jobID,
      jobAppliedDate,
    },
    { new: true }
  );

  revalidatePath(pathToRevalidate);
};

export const createFilterCategoryAction = async () => {
  await connectToDB();
  const result = await Job.find({});

  return JSON.parse(JSON.stringify(result));
};

export const updateProfileAction = async (data, pathToRevalidate) => {
  await connectToDB();
  const {
    userId,
    role,
    email,
    isPremiumUser,
    memberShipType,
    memberShipStartDate,
    memberShipEndDate,
    recruiterInfo,
    candidateInfo,
    _id,
  } = data;

  await Profile.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      userId,
      role,
      email,
      isPremiumUser,
      memberShipType,
      memberShipStartDate,
      memberShipEndDate,
      recruiterInfo,
      candidateInfo,
    },
    { new: true }
  );

  revalidatePath(pathToRevalidate);
};

export const createPriceIdAction = async (data) => {
  const session = await stripe.prices.create({
    currency: "inr",
    unit_amount: data?.amount * 100,
    recurring: {
      interval: "year",
    },
    product_data: {
      name: "Premium Plan",
    },
  });

  return {
    success: true,
    id: session?.id,
  };
};

export const createStripePaymentAction = async (data) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: data?.lineItems,
    mode: "subscription",
    success_url: `http://localhost:3000/membership` + "?status=success",
    cancel_url: `http://localhost:3000/membership` + "?status=cancel",
  });

  return {
    success: true,
    id: session?.id,
  };
};

export const fetchAllFeedPostsAction = async () => {
  await connectToDB();
  const result = await Feed.find({});

  return JSON.parse(JSON.stringify(result));
};

export const createFeedPostAction = async (data, pathToRevalidate) => {
  await connectToDB();
  await Feed.create(data);
  revalidatePath(pathToRevalidate);
};

export const updateFeedPostAction = async (data, pathToRevalidate) => {
  await connectToDB();
  const { userId, userName, message, image, likes, _id } = data;

  await Feed.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      userId,
      userName,
      image,
      message,
      likes,
    },
    { new: true }
  );

  revalidatePath(pathToRevalidate);
};
