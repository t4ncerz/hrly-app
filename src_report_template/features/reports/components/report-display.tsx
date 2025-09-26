"use client";

import { useEffect, useState } from "react";
import { ReportContent } from "@/drizzle/schema/report";
import { getReport } from "../actions/reports";
import { Button } from "@/components/ui/button";

interface ReportDisplayProps {
  reportContent: ReportContent;
  reportId?: string;
}

interface ReportDisplayWrapperProps {
  reportId: string;
}

function ReportDisplayComponent({
  reportContent,
  reportId,
}: ReportDisplayProps) {
  const handleDownloadPDF = () => {
    if (reportId) {
      window.open(`/reports/${reportId}/print?print=true`, "_blank");
    }
  };

  console.log(reportContent);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="h1 text-gray-900 dark:text-white mb-2">
              {reportContent.title_page.company_name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {reportContent.title_page.report_title}
            </p>
          </div>
          {reportId && (
            <Button
              onClick={handleDownloadPDF}
              variant="primary"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            >
              Pobierz PDF
            </Button>
          )}
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="h3 text-gray-900 dark:text-white mb-6">
          {reportContent.table_of_contents.title}
        </h2>
        <div className="space-y-3">
          {reportContent.table_of_contents.items.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-8 h-8 bg-violet-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 shrink-0">
                {index + 1}
              </div>
              <span className="text-gray-800 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Analysis */}
      <div className="space-y-6">
        <h2 className="h2 text-gray-900 dark:text-white">Analiza Ogólna</h2>

        {/* Engagement Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-violet-500 rounded-full mr-3"></div>
            <h3 className="h4 text-gray-900 dark:text-white">
              {reportContent.overall_analysis.engagement.title}
            </h3>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-extrabold text-violet-500">
                {reportContent.overall_analysis.engagement.overall_score}
              </div>
              {reportContent.overall_analysis.engagement.level && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Poziom:</span>
                  <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                    {reportContent.overall_analysis.engagement.level}/5
                  </div>
                </div>
              )}
            </div>

            {reportContent.overall_analysis.engagement.definition && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Interpretacja poziomu
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {reportContent.overall_analysis.engagement.definition}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reportContent.overall_analysis.engagement.attitude_points.length >
              0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Postawa
                </h4>
                <ul className="space-y-1">
                  {reportContent.overall_analysis.engagement.attitude_points.map(
                    (point, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 shrink-0"></span>
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {reportContent.overall_analysis.engagement.duties_points.length >
              0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Wykonywanie obowiązków
                </h4>
                <ul className="space-y-1">
                  {reportContent.overall_analysis.engagement.duties_points.map(
                    (point, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 shrink-0"></span>
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {reportContent.overall_analysis.engagement.loyalty_points.length >
              0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Lojalność i zaangażowanie
                </h4>
                <ul className="space-y-1">
                  {reportContent.overall_analysis.engagement.loyalty_points.map(
                    (point, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 shrink-0"></span>
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {reportContent.overall_analysis.engagement.businessImpact && (
            <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-500/10 rounded-lg border border-violet-200 dark:border-violet-500/20">
              <h4 className="font-semibold text-violet-900 dark:text-violet-300 mb-2">
                Wpływ na biznes
              </h4>
              <p className="text-violet-800 dark:text-violet-400">
                {reportContent.overall_analysis.engagement.businessImpact}
              </p>
            </div>
          )}
        </div>

        {/* Satisfaction Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <h3 className="h4 text-gray-900 dark:text-white">
              {reportContent.overall_analysis.satisfaction.title}
            </h3>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-extrabold text-green-500">
                {reportContent.overall_analysis.satisfaction.overall_score}
              </div>
              {reportContent.overall_analysis.satisfaction.level && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Poziom:</span>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {reportContent.overall_analysis.satisfaction.level}/5
                  </div>
                </div>
              )}
            </div>

            {reportContent.overall_analysis.satisfaction.definition && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Interpretacja poziomu
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {reportContent.overall_analysis.satisfaction.definition}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reportContent.overall_analysis.satisfaction.attitude_points
              .length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Postawa
                </h4>
                <ul className="space-y-1">
                  {reportContent.overall_analysis.satisfaction.attitude_points.map(
                    (point, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 shrink-0"></span>
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {reportContent.overall_analysis.satisfaction.duties_points.length >
              0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Wykonywanie obowiązków
                </h4>
                <ul className="space-y-1">
                  {reportContent.overall_analysis.satisfaction.duties_points.map(
                    (point, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 shrink-0"></span>
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {reportContent.overall_analysis.satisfaction.loyalty_points.length >
              0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Lojalność i zaangażowanie
                </h4>
                <ul className="space-y-1">
                  {reportContent.overall_analysis.satisfaction.loyalty_points.map(
                    (point, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 shrink-0"></span>
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {reportContent.overall_analysis.satisfaction.businessImpact && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                Wpływ na biznes
              </h4>
              <p className="text-green-800 dark:text-green-400">
                {reportContent.overall_analysis.satisfaction.businessImpact}
              </p>
            </div>
          )}
        </div>

        {/* Recommendations for Engagement and Satisfaction */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Engagement Recommendations */}
          {reportContent.overall_analysis.engagement.recommendations &&
            reportContent.overall_analysis.engagement.recommendations.length >
              0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-violet-500 rounded-full mr-3"></div>
                  <h3 className="h4 text-gray-900 dark:text-white">
                    Rekomendacje dla zaangażowania
                  </h3>
                </div>
                <div className="space-y-3">
                  {reportContent.overall_analysis.engagement.recommendations.map(
                    (recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 shrink-0"></span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {recommendation}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Satisfaction Recommendations */}
          {reportContent.overall_analysis.satisfaction.recommendations &&
            reportContent.overall_analysis.satisfaction.recommendations.length >
              0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <h3 className="h4 text-gray-900 dark:text-white">
                    Rekomendacje dla satysfakcji
                  </h3>
                </div>
                <div className="space-y-3">
                  {reportContent.overall_analysis.satisfaction.recommendations.map(
                    (recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {recommendation}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Top Scores */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lowest Scores */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <h3 className="h4 text-gray-900 dark:text-white">
                {reportContent.overall_analysis.top_scores.lowest.title}
              </h3>
            </div>

            <div className="space-y-4">
              {reportContent.overall_analysis.top_scores.lowest.data.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-500/10 rounded-lg"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.area}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-red-600 dark:text-red-400">
                        {item.average}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Zakres: {item.range}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {reportContent.overall_analysis.top_scores.lowest.insight && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-500/20 rounded-lg border border-red-200 dark:border-red-500/30">
                <p className="text-red-800 dark:text-red-300 text-sm">
                  {reportContent.overall_analysis.top_scores.lowest.insight}
                </p>
              </div>
            )}
          </div>

          {/* Highest Scores */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h3 className="h4 text-gray-900 dark:text-white">
                {reportContent.overall_analysis.top_scores.highest.title}
              </h3>
            </div>

            <div className="space-y-4">
              {reportContent.overall_analysis.top_scores.highest.data.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-500/10 rounded-lg"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.area}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {item.average}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Zakres: {item.range}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {reportContent.overall_analysis.top_scores.highest.insight && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-500/20 rounded-lg border border-green-200 dark:border-green-500/30">
                <p className="text-green-800 dark:text-green-300 text-sm">
                  {reportContent.overall_analysis.top_scores.highest.insight}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Areas */}
      <div className="space-y-6">
        <h2 className="h2 text-gray-900 dark:text-white">
          Szczegółowa Analiza Obszarów
        </h2>

        {reportContent.detailed_areas.map((area, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="h3 text-gray-900 dark:text-white">
                {area.area_name}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Summary */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {area.company_summary.title}
                </h4>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-4">
                  {area.company_summary.overall_average_text}
                </p>

                {area.company_summary.sub_areas_breakdown.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {area.company_summary.sub_areas_breakdown.map(
                      (subArea, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {subArea.name}
                          </span>
                          <div className="text-right">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {subArea.value}
                            </span>
                            {subArea.score && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ({subArea.score})
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {area.company_summary.key_findings_points.length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {area.company_summary.key_findings_header}
                    </h5>
                    <ul className="space-y-2">
                      {area.company_summary.key_findings_points.map(
                        (finding, findingIndex) => (
                          <li
                            key={findingIndex}
                            className="text-gray-600 dark:text-gray-400 flex items-start"
                          >
                            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 mr-3 shrink-0"></span>
                            {finding}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {area.company_summary.summary_paragraph && (
                  <div className="p-4 bg-violet-50 dark:bg-violet-500/10 rounded-lg border border-violet-200 dark:border-violet-500/20">
                    <h5 className="font-semibold text-violet-900 dark:text-violet-300 mb-2">
                      {area.company_summary.summary_header}
                    </h5>
                    <p className="text-violet-800 dark:text-violet-400">
                      {area.company_summary.summary_paragraph}
                    </p>
                  </div>
                )}
              </div>

              {/* Team Breakdown */}
              {area.team_breakdown.data.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {area.team_breakdown.title}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          {area.team_breakdown.table_headers.map(
                            (header, headerIndex) => (
                              <th
                                key={headerIndex}
                                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {area.team_breakdown.data.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            {area.team_breakdown.table_headers.map(
                              (header, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"
                                >
                                  {Array.isArray(row[header]) ? (
                                    <ul className="space-y-1">
                                      {(row[header] as string[]).map(
                                        (item, itemIndex) => (
                                          <li
                                            key={itemIndex}
                                            className="text-xs flex items-start"
                                          >
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 shrink-0"></span>
                                            {item}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    row[header] || ""
                                  )}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Organizational Recommendations */}
              {area.organizational_recommendations.recommendation_blocks
                .length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {area.organizational_recommendations.title}
                  </h4>
                  <div className="grid gap-4">
                    {area.organizational_recommendations.recommendation_blocks.map(
                      (block, blockIndex) => (
                        <div
                          key={blockIndex}
                          className="p-4 bg-sky-50 dark:bg-sky-500/10 rounded-lg border border-sky-200 dark:border-sky-500/20"
                        >
                          <h5 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">
                            {block.title}
                          </h5>
                          <ul className="space-y-2">
                            {block.points.map((point, pointIndex) => (
                              <li
                                key={pointIndex}
                                className="text-sky-800 dark:text-sky-400 text-sm flex items-start"
                              >
                                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 mr-3 shrink-0"></span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Business Impact */}
              {area.business_impact.points.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20">
                  <h4 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">
                    {area.business_impact.title}
                  </h4>
                  <ul className="space-y-2">
                    {area.business_impact.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="text-red-800 dark:text-red-400 font-medium text-sm flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Leader Guidelines */}
      <div className="space-y-6">
        <h2 className="h2 text-gray-900 dark:text-white">
          Wskazówki dla Liderów
        </h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reportContent.leader_guidelines.map((guideline, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {guideline.department}
              </h3>

              <div className="space-y-4">
                {guideline.start.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-lg mr-2">🚀</span>
                      <h4 className="font-semibold text-green-700 dark:text-green-400">
                        START
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {guideline.start.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guideline.stop.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-lg mr-2">🛑</span>
                      <h4 className="font-semibold text-red-700 dark:text-red-400">
                        STOP
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {guideline.stop.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guideline.continue.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-lg mr-2">⏩</span>
                      <h4 className="font-semibold text-sky-700 dark:text-sky-400">
                        CONTINUE
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {guideline.continue.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 mr-3 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportDisplay({ reportId }: ReportDisplayWrapperProps) {
  const [reportContent, setReportContent] = useState<ReportContent | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const report = await getReport(reportId);
        if (report) {
          setReportContent(report.content);
        } else {
          setError("Report not found");
        }
      } catch (err) {
        setError("Failed to load report");
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!reportContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No report content available</div>
      </div>
    );
  }

  return (
    <ReportDisplayComponent reportContent={reportContent} reportId={reportId} />
  );
}
