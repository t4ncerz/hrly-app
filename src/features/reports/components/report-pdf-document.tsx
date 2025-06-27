import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportContent } from "@/drizzle/schema/report";

// Register fonts (optional - you may need to add font files)
// Font.register({
//   family: 'Open Sans',
//   src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  subsectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: "bold",
    color: "#444444",
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    lineHeight: 1.4,
    color: "#333333",
  },
  listItem: {
    fontSize: 10,
    marginBottom: 3,
    marginLeft: 15,
    lineHeight: 1.3,
  },
  tableContainer: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#F5F5F5",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 5,
  },
  scoreBox: {
    backgroundColor: "#F0F8FF",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0066CC",
  },
  topScoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    padding: 5,
    backgroundColor: "#FAFAFA",
  },
  guidelineBox: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 5,
  },
  guidelineTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  guidelineSection: {
    marginBottom: 8,
  },
  guidelineHeader: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 3,
  },
  startHeader: { color: "#22C55E" },
  stopHeader: { color: "#EF4444" },
  continueHeader: { color: "#3B82F6" },
  welcomeHeader: { color: "#8B5CF6" },
});

interface ReportPdfDocumentProps {
  reportContent: ReportContent;
}

export const ReportPdfDocument: React.FC<ReportPdfDocumentProps> = ({
  reportContent,
}) => (
  <Document>
    {/* Title Page */}
    <Page size="A4" style={styles.page}>
      <View style={{ textAlign: "center", marginTop: 100 }}>
        <Text style={styles.title}>
          {reportContent.title_page.company_name}
        </Text>
        <Text style={styles.subtitle}>
          {reportContent.title_page.report_title}
        </Text>
      </View>
    </Page>

    {/* Table of Contents */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>
        {reportContent.table_of_contents.title}
      </Text>
      {reportContent.table_of_contents.items.map((item, index) => (
        <Text key={index} style={styles.text}>
          {index + 1}. {item}
        </Text>
      ))}
    </Page>

    {/* Overall Analysis */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Analiza Ogólna</Text>

      {/* Engagement */}
      <Text style={styles.subsectionTitle}>
        {reportContent.overall_analysis.engagement.title}
      </Text>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>
          {reportContent.overall_analysis.engagement.overall_score}
        </Text>
      </View>

      {reportContent.overall_analysis.engagement.main_description && (
        <Text style={styles.text}>
          {reportContent.overall_analysis.engagement.main_description}
        </Text>
      )}

      {reportContent.overall_analysis.engagement.attitude_points.length > 0 && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>Postawa</Text>
          {reportContent.overall_analysis.engagement.attitude_points.map(
            (point, index) => (
              <Text key={index} style={styles.listItem}>
                • {point}
              </Text>
            )
          )}
        </View>
      )}

      {reportContent.overall_analysis.engagement.duties_points.length > 0 && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Wykonywanie obowiązków
          </Text>
          {reportContent.overall_analysis.engagement.duties_points.map(
            (point, index) => (
              <Text key={index} style={styles.listItem}>
                • {point}
              </Text>
            )
          )}
        </View>
      )}

      {reportContent.overall_analysis.engagement.loyalty_points.length > 0 && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Lojalność i zaangażowanie
          </Text>
          {reportContent.overall_analysis.engagement.loyalty_points.map(
            (point, index) => (
              <Text key={index} style={styles.listItem}>
                • {point}
              </Text>
            )
          )}
        </View>
      )}

      {reportContent.overall_analysis.engagement.businessImpact && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Wpływ na biznes
          </Text>
          <Text style={styles.text}>
            {reportContent.overall_analysis.engagement.businessImpact}
          </Text>
        </View>
      )}

      {/* Satisfaction */}
      <Text style={styles.subsectionTitle}>
        {reportContent.overall_analysis.satisfaction.title}
      </Text>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>
          {reportContent.overall_analysis.satisfaction.overall_score}
        </Text>
      </View>

      {reportContent.overall_analysis.satisfaction.main_description && (
        <Text style={styles.text}>
          {reportContent.overall_analysis.satisfaction.main_description}
        </Text>
      )}

      {reportContent.overall_analysis.satisfaction.attitude_points.length >
        0 && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>Postawa</Text>
          {reportContent.overall_analysis.satisfaction.attitude_points.map(
            (point, index) => (
              <Text key={index} style={styles.listItem}>
                • {point}
              </Text>
            )
          )}
        </View>
      )}

      {reportContent.overall_analysis.satisfaction.duties_points.length > 0 && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Wykonywanie obowiązków
          </Text>
          {reportContent.overall_analysis.satisfaction.duties_points.map(
            (point, index) => (
              <Text key={index} style={styles.listItem}>
                • {point}
              </Text>
            )
          )}
        </View>
      )}

      {reportContent.overall_analysis.satisfaction.loyalty_points.length >
        0 && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Lojalność i zaangażowanie
          </Text>
          {reportContent.overall_analysis.satisfaction.loyalty_points.map(
            (point, index) => (
              <Text key={index} style={styles.listItem}>
                • {point}
              </Text>
            )
          )}
        </View>
      )}

      {reportContent.overall_analysis.satisfaction.businessImpact && (
        <View>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Wpływ na biznes
          </Text>
          <Text style={styles.text}>
            {reportContent.overall_analysis.satisfaction.businessImpact}
          </Text>
        </View>
      )}
    </Page>

    {/* Top Scores */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Najważniejsze Wyniki</Text>

      {/* Lowest Scores */}
      <Text style={styles.subsectionTitle}>
        {reportContent.overall_analysis.top_scores.lowest.title}
      </Text>
      {reportContent.overall_analysis.top_scores.lowest.data.map(
        (item, index) => (
          <View key={index} style={styles.topScoreItem}>
            <Text style={[styles.text, { flex: 1 }]}>{item.area}</Text>
            <Text style={[styles.text, { fontWeight: "bold" }]}>
              {item.average} (Zakres: {item.range})
            </Text>
          </View>
        )
      )}
      {reportContent.overall_analysis.top_scores.lowest.insight && (
        <Text style={styles.text}>
          {reportContent.overall_analysis.top_scores.lowest.insight}
        </Text>
      )}

      {/* Highest Scores */}
      <Text style={styles.subsectionTitle}>
        {reportContent.overall_analysis.top_scores.highest.title}
      </Text>
      {reportContent.overall_analysis.top_scores.highest.data.map(
        (item, index) => (
          <View key={index} style={styles.topScoreItem}>
            <Text style={[styles.text, { flex: 1 }]}>{item.area}</Text>
            <Text style={[styles.text, { fontWeight: "bold" }]}>
              {item.average} (Zakres: {item.range})
            </Text>
          </View>
        )
      )}
      {reportContent.overall_analysis.top_scores.highest.insight && (
        <Text style={styles.text}>
          {reportContent.overall_analysis.top_scores.highest.insight}
        </Text>
      )}
    </Page>

    {/* Detailed Areas */}
    {reportContent.detailed_areas.map((area, areaIndex) => (
      <Page key={areaIndex} size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>{area.area_name}</Text>

        {/* Company Summary */}
        <Text style={styles.subsectionTitle}>{area.company_summary.title}</Text>
        <Text style={styles.text}>
          {area.company_summary.overall_average_text}
        </Text>

        {area.company_summary.sub_areas_breakdown.length > 0 && (
          <View>
            {area.company_summary.sub_areas_breakdown.map(
              (subArea, subIndex) => (
                <View key={subIndex} style={styles.topScoreItem}>
                  <Text style={[styles.text, { flex: 1 }]}>{subArea.name}</Text>
                  <Text style={[styles.text, { fontWeight: "bold" }]}>
                    {subArea.value} {subArea.score && `(${subArea.score})`}
                  </Text>
                </View>
              )
            )}
          </View>
        )}

        {area.company_summary.key_findings_points.length > 0 && (
          <View>
            <Text style={[styles.text, { fontWeight: "bold" }]}>
              {area.company_summary.key_findings_header}
            </Text>
            {area.company_summary.key_findings_points.map(
              (finding, findingIndex) => (
                <Text key={findingIndex} style={styles.listItem}>
                  • {finding}
                </Text>
              )
            )}
          </View>
        )}

        {area.company_summary.summary_paragraph && (
          <View>
            <Text style={[styles.text, { fontWeight: "bold" }]}>
              {area.company_summary.summary_header}
            </Text>
            <Text style={styles.text}>
              {area.company_summary.summary_paragraph}
            </Text>
          </View>
        )}

        {/* Team Breakdown */}
        {area.team_breakdown.data.length > 0 && (
          <View style={styles.tableContainer}>
            <Text style={styles.subsectionTitle}>
              {area.team_breakdown.title}
            </Text>
            <View style={[styles.tableRow, styles.tableHeader]}>
              {area.team_breakdown.table_headers.map((header, headerIndex) => (
                <Text key={headerIndex} style={styles.tableCell}>
                  {header}
                </Text>
              ))}
            </View>
            {area.team_breakdown.data.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {area.team_breakdown.table_headers.map((header, cellIndex) => (
                  <Text key={cellIndex} style={styles.tableCell}>
                    {Array.isArray(row[header])
                      ? (row[header] as string[]).join(", ")
                      : row[header] || ""}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Organizational Recommendations */}
        {area.organizational_recommendations.recommendation_blocks.length >
          0 && (
          <View>
            <Text style={styles.subsectionTitle}>
              {area.organizational_recommendations.title}
            </Text>
            {area.organizational_recommendations.recommendation_blocks.map(
              (block, blockIndex) => (
                <View key={blockIndex}>
                  <Text style={[styles.text, { fontWeight: "bold" }]}>
                    {block.title}
                  </Text>
                  {block.points.map((point, pointIndex) => (
                    <Text key={pointIndex} style={styles.listItem}>
                      • {point}
                    </Text>
                  ))}
                </View>
              )
            )}
          </View>
        )}

        {/* Business Impact */}
        {area.business_impact.points.length > 0 && (
          <View>
            <Text style={styles.subsectionTitle}>
              {area.business_impact.title}
            </Text>
            {area.business_impact.points.map((point, pointIndex) => (
              <Text key={pointIndex} style={styles.listItem}>
                • {point}
              </Text>
            ))}
          </View>
        )}
      </Page>
    ))}

    {/* Leader Guidelines */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Wskazówki dla Liderów</Text>
      {reportContent.leader_guidelines.map((guideline, index) => (
        <View key={index} style={styles.guidelineBox}>
          <Text style={styles.guidelineTitle}>{guideline.department}</Text>

          {guideline.start.length > 0 && (
            <View style={styles.guidelineSection}>
              <Text style={[styles.guidelineHeader, styles.startHeader]}>
                🚀 START
              </Text>
              {guideline.start.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.listItem}>
                  • {item}
                </Text>
              ))}
            </View>
          )}

          {guideline.stop.length > 0 && (
            <View style={styles.guidelineSection}>
              <Text style={[styles.guidelineHeader, styles.stopHeader]}>
                🛑 STOP
              </Text>
              {guideline.stop.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.listItem}>
                  • {item}
                </Text>
              ))}
            </View>
          )}

          {guideline.continue.length > 0 && (
            <View style={styles.guidelineSection}>
              <Text style={[styles.guidelineHeader, styles.continueHeader]}>
                ⏩ CONTINUE
              </Text>
              {guideline.continue.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.listItem}>
                  • {item}
                </Text>
              ))}
            </View>
          )}

          {guideline.welcome.length > 0 && (
            <View style={styles.guidelineSection}>
              <Text style={[styles.guidelineHeader, styles.welcomeHeader]}>
                ⭐ WELCOME
              </Text>
              {guideline.welcome.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.listItem}>
                  • {item}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </Page>
  </Document>
);
