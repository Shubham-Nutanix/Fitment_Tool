import React from "react";
import PropTypes from "prop-types";
import defaults from "lodash/defaults";
import { EntityBrowser } from "@nutanix-ui/ebr-ui";

const EntityBrowserView = ({
  entityType,
  pollingSec = 60,
  queryProcessorName = "GroupsV3UQDC",
  ...props
}) => {
  const ebConfiguration = defaults({}, props, {
    entityTypeDisplayNames: {
      [entityType]: {
        singular: entityType,
        plural: entityType,
      },
    },
    entityGroupings: [
      {
        entities: [{ entity: entityType }],
      },
    ],
    notificationsContainer: false,
    entityTypes: [entityType],
    queryConfig: {
      pollingSec,
      queryProcessorName,
    },
  });

  return <EntityBrowser {...ebConfiguration} />;
};

EntityBrowserView.propTypes = {
  entityConfigs: PropTypes.object,
  entityTypeDisplayNames: PropTypes.object,
  entityGroupings: PropTypes.object,
  entityTypes: PropTypes.array,
  queryConfig: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  pollingSec: PropTypes.number,
  queryProcessorName: PropTypes.string,
};

export default EntityBrowserView;
