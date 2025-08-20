import { Schema, SchemaType } from "@google/generative-ai";

export const reportSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title_page: {
      type: SchemaType.OBJECT,
      properties: {
        company_name: { type: SchemaType.STRING },
        report_title: { type: SchemaType.STRING },
      },
      required: ["company_name", "report_title"],
    },
    table_of_contents: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        items: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["title", "items"],
    },
    overall_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        engagement: {
          type: SchemaType.OBJECT,
          properties: {
            overall_score: { type: SchemaType.NUMBER },
            title: { type: SchemaType.STRING },
            level: { type: SchemaType.NUMBER },
            definition: { type: SchemaType.STRING },
            recommendations: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            linked_indicators: { type: SchemaType.STRING },
            main_description: { type: SchemaType.STRING },
            attitude_points: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            duties_points: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            loyalty_points: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            businessImpact: { type: SchemaType.STRING },
          },
          required: [
            "overall_score",
            "title",
            "main_description",
            "attitude_points",
            "duties_points",
            "loyalty_points",
            "businessImpact",
          ],
        },
        satisfaction: {
          type: SchemaType.OBJECT,
          properties: {
            overall_score: { type: SchemaType.NUMBER },
            title: { type: SchemaType.STRING },
            level: { type: SchemaType.NUMBER },
            definition: { type: SchemaType.STRING },
            recommendations: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            linked_indicators: { type: SchemaType.STRING },
            main_description: { type: SchemaType.STRING },
            attitude_points: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            duties_points: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            loyalty_points: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            businessImpact: { type: SchemaType.STRING },
          },
          required: [
            "overall_score",
            "title",
            "main_description",
            "attitude_points",
            "duties_points",
            "loyalty_points",
            "businessImpact",
          ],
        },
        top_scores: {
          type: SchemaType.OBJECT,
          properties: {
            lowest: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                data: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      area: { type: SchemaType.STRING },
                      average: { type: SchemaType.NUMBER },
                      range: { type: SchemaType.STRING },
                    },
                    required: ["area", "average", "range"],
                  },
                },
                insight: { type: SchemaType.STRING },
              },
              required: ["title", "data", "insight"],
            },
            highest: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                data: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      area: { type: SchemaType.STRING },
                      average: { type: SchemaType.NUMBER },
                      range: { type: SchemaType.STRING },
                    },
                    required: ["area", "average", "range"],
                  },
                },
                insight: { type: SchemaType.STRING },
              },
              required: ["title", "data", "insight"],
            },
          },
          required: ["lowest", "highest"],
        },
      },
      required: ["engagement", "satisfaction", "top_scores"],
    },
    detailed_areas: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          area_name: { type: SchemaType.STRING },
          company_summary: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              overall_average_text: { type: SchemaType.STRING },
              sub_areas_breakdown: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING },
                    value: { type: SchemaType.STRING },
                    score: { type: SchemaType.STRING },
                  },
                },
              },
              key_findings_header: { type: SchemaType.STRING },
              key_findings_points: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              summary_header: { type: SchemaType.STRING },
              summary_paragraph: { type: SchemaType.STRING },
            },
            required: [
              "title",
              "overall_average_text",
              "key_findings_header",
              "key_findings_points",
              "summary_header",
              "summary_paragraph",
            ],
          },
          team_breakdown: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              table_headers: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              data: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    Dział: { type: SchemaType.STRING },
                    Wynik: { type: SchemaType.STRING },
                    Interpretacja: { type: SchemaType.STRING },
                    "Jak poprawić wynik?": {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                    },
                  },
                },
              },
            },
            required: ["title", "table_headers", "data"],
          },
          organizational_recommendations: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              recommendation_blocks: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    title: { type: SchemaType.STRING },
                    points: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                    },
                  },
                  required: ["title", "points"],
                },
              },
            },
            required: ["title", "recommendation_blocks"],
          },
          business_impact: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              points: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
            },
            required: ["title", "points"],
          },
        },
        required: [
          "area_name",
          "company_summary",
          "team_breakdown",
          "organizational_recommendations",
          "business_impact",
        ],
      },
    },
    leader_guidelines: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          department: { type: SchemaType.STRING },
          start: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          stop: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          continue: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          welcome: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["department", "start", "stop", "continue", "welcome"],
      },
    },
  },
  required: [
    "title_page",
    "table_of_contents",
    "overall_analysis",
    "detailed_areas",
    "leader_guidelines",
  ],
};
