import { CUSTOM_FORMATTERS, PROPS } from "../constant.js";

export const dbServerPerspectives = () => {
  return [
    {
      name: "_common_",
      entityAttributes: {
        idAttribute: [PROPS.ENTITY_NAME],
        primaryAttribute: PROPS.ENTITY_NAME,
        customRenders: {
          [PROPS.ENTITY_NAME]: {
            formatter: CUSTOM_FORMATTERS.NAME,
          },
          [PROPS.OVERALL_FITMENT_STATUS]: {
            formatter: CUSTOM_FORMATTERS.STATUS,
          },
          [PROPS.INSTANCES_COUNT]: {
            formatter: CUSTOM_FORMATTERS.DATABASES,
          },
          [PROPS.DATABASES_COUNT]: {
            formatter: CUSTOM_FORMATTERS.DETAILS,
          },
          [PROPS.ACTIONS]: {
            formatter: CUSTOM_FORMATTERS.ACTIONS,
          },
        },
        filterByAttributes: [PROPS.NAME, PROPS.OVERALL_FITMENT_STATUS],
        defaultGroupByAttribute: "",
        summaries: {},
      },
      visualizations: [
        {
          name: "grid",
          viewName: "Grid",
          entityAttributes: {},
        },
      ],
    },
    {
      name: "General",
      entityAttributes: {
        displayAttributes: [
          PROPS.ENTITY_NAME,
          PROPS.INSTANCES_COUNT,
          PROPS.DATABASES_COUNT,
          PROPS.OVERALL_FITMENT_STATUS,
          PROPS.ACTIONS,
        ],
        customRenders: {
          // [PROPS.ENTITY_NAME]: {
          //   columnWidth: "20%",
          //   formatter: CUSTOM_FORMATTERS.NAME,
          // },
          [PROPS.OVERALL_FITMENT_STATUS]: {
            columnWidth: "20%",
            formatter: CUSTOM_FORMATTERS.FITMENT_STATUS,
          },
          [PROPS.ACTIONS]: {
            columnWidth: "20%",
            formatter: CUSTOM_FORMATTERS.ACTIONS,
          },
          // [PROPS.INSTANCES_COUNT]: {
          //   columnWidth: "20%",
          //   formatter: CUSTOM_FORMATTERS.DATABASES,
          // },
          // [PROPS.DATABASES_COUNT]: {
          //   columnWidth: "20%",
          //   formatter: CUSTOM_FORMATTERS.DETAILS,
          // },
        },
      },
    },
  ];
};
