import { getReport } from "@/features/reports/db/reports";
import { notFound } from "next/navigation";

interface PrintPageProps {
  params: Promise<{ reportId: string }>;
}

export default async function PrintPage({ params }: PrintPageProps) {
  const { reportId } = await params;

  const report = await getReport(reportId);

  if (!report) {
    notFound();
  }

  const { content } = report;

  return (
    <html>
      <head>
        <title>Raport HR - {content.title_page.company_name}</title>
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #333;
            }
            .page-break {
              page-break-before: always;
            }
            .no-print {
              display: none;
            }
          }
          
          body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          h1 { font-size: 24px; margin-bottom: 20px; }
          h2 { font-size: 20px; margin: 20px 0 10px 0; }
          h3 { font-size: 16px; margin: 15px 0 8px 0; }
          h4 { font-size: 14px; margin: 10px 0 5px 0; }
          
          .title-page {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .score-box {
            background: #f0f8ff;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
          }
          
          .top-score-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0;
            padding: 8px;
            background: #fafafa;
          }
          
          .guideline-box {
            margin: 15px 0;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          
          .guideline-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .guideline-section {
            margin: 10px 0;
          }
          
          .guideline-header {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .start-header { color: #22c55e; }
          .stop-header { color: #ef4444; }
          .continue-header { color: #3b82f6; }
          .welcome-header { color: #8b5cf6; }
          
          ul { margin: 5px 0; padding-left: 20px; }
          li { margin: 3px 0; }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background: #f5f5f5;
            font-weight: bold;
          }
          
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
          
          .print-button:hover {
            background: #0052a3;
          }
        `}</style>
      </head>
      <body>
        <button
          className="print-button no-print"
          onClick={() => window.print()}
        >
          Drukuj / Zapisz jako PDF
        </button>

        {/* Title Page */}
        <div className="title-page">
          <h1>{content.title_page.company_name}</h1>
          <h2>{content.title_page.report_title}</h2>
        </div>

        {/* Table of Contents */}
        <div className="page-break">
          <h2>{content.table_of_contents.title}</h2>
          <ol>
            {content.table_of_contents.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        {/* Overall Analysis */}
        <div className="page-break">
          <h2>Analiza Ogólna</h2>

          {/* Engagement */}
          <h3>{content.overall_analysis.engagement.title}</h3>
          <div className="score-box">
            {content.overall_analysis.engagement.overall_score}
          </div>

          {content.overall_analysis.engagement.definition && (
            <p>{content.overall_analysis.engagement.definition}</p>
          )}

          {content.overall_analysis.engagement.attitude_points.length > 0 && (
            <div>
              <h4>Postawa</h4>
              <ul>
                {content.overall_analysis.engagement.attitude_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {content.overall_analysis.engagement.duties_points.length > 0 && (
            <div>
              <h4>Wykonywanie obowiązków</h4>
              <ul>
                {content.overall_analysis.engagement.duties_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {content.overall_analysis.engagement.loyalty_points.length > 0 && (
            <div>
              <h4>Lojalność i zaangażowanie</h4>
              <ul>
                {content.overall_analysis.engagement.loyalty_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {content.overall_analysis.engagement.businessImpact && (
            <div>
              <h4>Wpływ na biznes</h4>
              <p>{content.overall_analysis.engagement.businessImpact}</p>
            </div>
          )}

          {/* Satisfaction */}
          <h3>{content.overall_analysis.satisfaction.title}</h3>
          <div className="score-box">
            {content.overall_analysis.satisfaction.overall_score}
          </div>

          {content.overall_analysis.satisfaction.definition && (
            <p>{content.overall_analysis.satisfaction.definition}</p>
          )}

          {content.overall_analysis.satisfaction.attitude_points.length > 0 && (
            <div>
              <h4>Postawa</h4>
              <ul>
                {content.overall_analysis.satisfaction.attitude_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {content.overall_analysis.satisfaction.duties_points.length > 0 && (
            <div>
              <h4>Wykonywanie obowiązków</h4>
              <ul>
                {content.overall_analysis.satisfaction.duties_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {content.overall_analysis.satisfaction.loyalty_points.length > 0 && (
            <div>
              <h4>Lojalność i zaangażowanie</h4>
              <ul>
                {content.overall_analysis.satisfaction.loyalty_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {content.overall_analysis.satisfaction.businessImpact && (
            <div>
              <h4>Wpływ na biznes</h4>
              <p>{content.overall_analysis.satisfaction.businessImpact}</p>
            </div>
          )}
        </div>

        {/* Top Scores */}
        <div className="page-break">
          <h2>Najważniejsze Wyniki</h2>

          <h3>{content.overall_analysis.top_scores.lowest.title}</h3>
          {content.overall_analysis.top_scores.lowest.data.map(
            (item, index) => (
              <div key={index} className="top-score-item">
                <span>{item.area}</span>
                <span>
                  <strong>{item.average}</strong> (Zakres: {item.range})
                </span>
              </div>
            )
          )}
          {content.overall_analysis.top_scores.lowest.insight && (
            <p>{content.overall_analysis.top_scores.lowest.insight}</p>
          )}

          <h3>{content.overall_analysis.top_scores.highest.title}</h3>
          {content.overall_analysis.top_scores.highest.data.map(
            (item, index) => (
              <div key={index} className="top-score-item">
                <span>{item.area}</span>
                <span>
                  <strong>{item.average}</strong> (Zakres: {item.range})
                </span>
              </div>
            )
          )}
          {content.overall_analysis.top_scores.highest.insight && (
            <p>{content.overall_analysis.top_scores.highest.insight}</p>
          )}
        </div>

        {/* Detailed Areas */}
        {content.detailed_areas.map((area, areaIndex) => (
          <div key={areaIndex} className="page-break">
            <h2>{area.area_name}</h2>

            <h3>{area.company_summary.title}</h3>
            <p>
              <strong>{area.company_summary.overall_average_text}</strong>
            </p>

            {area.company_summary.key_findings_points.length > 0 && (
              <div>
                <h4>{area.company_summary.key_findings_header}</h4>
                <ul>
                  {area.company_summary.key_findings_points.map(
                    (finding, index) => (
                      <li key={index}>{finding}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {area.company_summary.summary_paragraph && (
              <div>
                <h4>{area.company_summary.summary_header}</h4>
                <p>{area.company_summary.summary_paragraph}</p>
              </div>
            )}

            {/* Team Breakdown */}
            {area.team_breakdown.data.length > 0 && (
              <div>
                <h3>{area.team_breakdown.title}</h3>
                <table>
                  <thead>
                    <tr>
                      {area.team_breakdown.table_headers.map(
                        (header, index) => (
                          <th key={index}>{header}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {area.team_breakdown.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {area.team_breakdown.table_headers.map(
                          (header, cellIndex) => (
                            <td key={cellIndex}>
                              {Array.isArray(row[header])
                                ? (row[header] as string[]).join(", ")
                                : row[header] || ""}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Organizational Recommendations */}
            {area.organizational_recommendations.recommendation_blocks.length >
              0 && (
              <div>
                <h3>{area.organizational_recommendations.title}</h3>
                {area.organizational_recommendations.recommendation_blocks.map(
                  (block, index) => (
                    <div key={index}>
                      <h4>{block.title}</h4>
                      <ul>
                        {block.points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Business Impact */}
            {area.business_impact.points.length > 0 && (
              <div>
                <h3>{area.business_impact.title}</h3>
                <ul>
                  {area.business_impact.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {/* Leader Guidelines */}
        <div className="page-break">
          <h2>Wskazówki dla Liderów</h2>
          {content.leader_guidelines.map((guideline, index) => (
            <div key={index} className="guideline-box">
              <div className="guideline-title">{guideline.department}</div>

              {guideline.start.length > 0 && (
                <div className="guideline-section">
                  <div className="guideline-header start-header">🚀 START</div>
                  <ul>
                    {guideline.start.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {guideline.stop.length > 0 && (
                <div className="guideline-section">
                  <div className="guideline-header stop-header">🛑 STOP</div>
                  <ul>
                    {guideline.stop.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {guideline.continue.length > 0 && (
                <div className="guideline-section">
                  <div className="guideline-header continue-header">
                    ⏩ CONTINUE
                  </div>
                  <ul>
                    {guideline.continue.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {guideline.welcome.length > 0 && (
                <div className="guideline-section">
                  <div className="guideline-header welcome-header">
                    ⭐ WELCOME
                  </div>
                  <ul>
                    {guideline.welcome.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Auto-print when accessed with print parameter
            if (new URLSearchParams(window.location.search).get('print') === 'true') {
              window.onload = () => {
                setTimeout(() => window.print(), 500);
              };
            }
          `,
          }}
        />
      </body>
    </html>
  );
}
