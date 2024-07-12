"use client";

import { filterMenuDataArray, formUrlQuery } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CandidateJobCard from "../candidate-job-card";
import PostNewJob from "../post-new-job";
import RecruiterJobCard from "../recruiter-job-card";
import { Label } from "../ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";

const JobListing = ({
  user,
  profileInfo,
  jobList,
  jobApplications,
  filterCategories,
}) => {
  const [filterParams, setFilterParams] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = (getSectionID, getCurrentOption) => {
    let cpFilPrms = { ...filterParams };
    const indexOfCurrentSection = Object.keys(cpFilPrms).indexOf(getSectionID);

    if (indexOfCurrentSection === -1) {
      cpFilPrms = {
        ...cpFilPrms,
        [getSectionID]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpFilPrms[getSectionID].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpFilPrms[getSectionID].push(getCurrentOption);
      else cpFilPrms[getSectionID].splice(indexOfCurrentOption, 1);
    }

    setFilterParams(cpFilPrms);
    sessionStorage.setItem("filterParams", JSON.stringify(cpFilPrms));
  };

  useEffect(() => {
    setFilterParams(JSON.parse(sessionStorage.getItem("filterParams")));
  }, []);

  useEffect(() => {
    if (filterParams && Object.keys(filterParams).length > 0) {
      const url = formUrlQuery({
        params: searchParams.toString(),
        dataToAdd: filterParams,
      });
      router.push(url, { scroll: false });
    }
  }, [filterParams, searchParams]);

  const filterMenus = filterMenuDataArray.map((item) => ({
    id: item.id,
    name: item.label,
    options: [
      ...new Set(filterCategories?.map((listItem) => listItem[item.id])),
    ],
  }));

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline dark:border-white justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900">
            {profileInfo?.role === "candidate"
              ? "Explore All Jobs"
              : "Jobs Dashboard"}
          </h1>
          <div className="flex items-center">
            {profileInfo?.role === "candidate" ? (
              <Menubar>
                {filterMenus?.map((filterMenu, key) => (
                  <MenubarMenu key={key}>
                    <MenubarTrigger>{filterMenu.name}</MenubarTrigger>
                    <MenubarContent>
                      {filterMenu?.options.map((option, optionIdx) => (
                        <MenubarItem
                          key={optionIdx}
                          className="flex items-center"
                          onClick={() => handleFilter(filterMenu.id, option)}
                        >
                          <div
                            className={`h-4 w-4 dark:border-white border rounded border-gray-900 ${
                              filterParams &&
                              Object.keys(filterParams).length > 0 &&
                              filterParams[filterMenu.id] &&
                              filterParams[filterMenu.id].indexOf(option) > -1
                                ? "bg-black dark:bg-white"
                                : ""
                            } `}
                          />

                          <Label className="ml-3 dark:text-white cursor-pointer text-sm text-gray-600">
                            {option}
                          </Label>
                        </MenubarItem>
                      ))}
                    </MenubarContent>
                  </MenubarMenu>
                ))}
              </Menubar>
            ) : (
              <PostNewJob
                jobList={jobList}
                user={user}
                profileInfo={profileInfo}
              />
            )}
          </div>
        </div>
        <div className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div className="lg:col-span-4">
              <div className="container mx-auto p-0 space-y-8">
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                  {jobList?.length > 0
                    ? jobList.map((jobItem, key) =>
                        profileInfo?.role === "candidate" ? (
                          <CandidateJobCard
                            key={key}
                            profileInfo={profileInfo}
                            jobItem={jobItem}
                            jobApplications={jobApplications}
                          />
                        ) : (
                          <RecruiterJobCard
                            key={key}
                            profileInfo={profileInfo}
                            jobItem={jobItem}
                            jobApplications={jobApplications}
                          />
                        )
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
