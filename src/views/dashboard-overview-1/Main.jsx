import {
  Lucide,
  Tippy,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  Litepicker,
  TinySlider,
} from "@/base-components";
import { faker as $f } from "@/utils";
import * as $_ from "lodash";
import classnames from "classnames";
import ReportLineChart from "@/components/report-line-chart/Main";
import ReportPieChart from "@/components/report-pie-chart/Main";
import ReportDonutChart from "@/components/report-donut-chart/Main";
import { useEffect, useRef, useState } from "react";
import { LoadingIcon } from "../../base-components";
import { Link } from "react-router-dom";
import { useGetAllJobStatusQuery } from "../../redux/features/dashboard/dashboardApi";

function Main() {
  const { data, isLoading } = useGetAllJobStatusQuery();
  console.log(data);

  const PricingReport = [
    {
      icon: "Users",
      iconColor: "text-primary",
      value: data?.data?.allUsers || 0,
      label: "Total Users",
      link: "/users",
    },
    {
      icon: "UserCheck",
      iconColor: "text-pending",
      value: data?.data?.allActiveUsers || 0,
      label: "Active Users",
      link: "/users?status=active",
    },
    {
      icon: "UserX",
      iconColor: "text-danger",
      value: data?.data?.allBlockedUsers || 0,
      label: "Blocked Users",
      link: "/users?status=inactive",
    },
    {
      icon: "Star",
      iconColor: "text-black",
      value: data?.data?.allRatinga || 0,
      label: "Total Reviews",
      link: "/reviews",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          className=""
          style={{ width: "100px", height: "100px" }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-12">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-8">
            {/* ----------------------------------Pricing & Revenue-------------------------------------------- */}
            <div className="mt-0">
              <p className="font-medium text-xl">Dashboard</p>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-4">
              {PricingReport.map((item, index) => (
                <Link
                  to={item.link}
                  key={index}
                  className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
                >
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <Lucide
                          icon={item.icon}
                          className={`report-box__icon ${item.iconColor}`}
                        />
                      </div>
                      <div
                        className={`text-3xl font-medium leading-8 mt-6  ${item.iconColor}`}
                      >
                        {item.value}
                      </div>
                      <div
                        className={`text-base text-slate-500 mt-1  ${item.iconColor}`}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* END: Sales Report */}
          {/* BEGIN: Weekly Top Seller */}
          {/* <div className="col-span-12 sm:col-span-12 lg:col-span-12 mt-2">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Reviews
              </h2>
            </div>
            <div className="intro-y box p-5 mt-5">
              <div className="mt-3">
                <ReportDonutChart height={313} data={analyticsData} />
              </div>
            </div>
          </div> */}

          {/* <div className="col-span-12 sm:col-span-12 lg:col-span-12">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Overall Statistics
              </h2>
            </div>
            <div className="intro-y box p-5 mt-5">
              <div className="mt-3">
                <ReportLineChart height={313} />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Main;
