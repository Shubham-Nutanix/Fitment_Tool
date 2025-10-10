//
// Copyright (c) 2024 Nutanix Inc. All rights reserved.
//
// The ProfilesPopupContainer is a top level component responsible for
// managing EBR actions for the profile entity
//

import { get } from "lodash";
import PropTypes from "prop-types";
import { connect } from "@nutanix-ui/ebr-ui";

/**
 * Operations that can be performed on a profile and requires an update ebr page
 * @type {string[]}
 * There is no need to add operations for Clone and Import profile here. Even though they
 * need a refresh in the EBR, the operation is same as for create profile which is
 * already tracked here.
 */

const DbServerPopupContainer = (props) => {
  const { actionId } = props;
  const { name, id } = props.selectedEntities[0] || {};
  const handleOnClose = () => {
    props.onClose();
  };
  const handleOnRefreshClose = () => {
    props.onClose();
    props.refreshQuery();
  };

  const handleDeleteClick = () => {
    props.onClose();
    props.refreshQuery();
  };

  if (!actionId) {
    return null;
  }
  switch (actionId) {
    default:
      return null;
  }
};

export const mapStateToProps = (state, ownProps) => {
  const { actionId } = ownProps.Getters.getCurrentPopup(state) || "";
  const ebSelectedEntities =
    ownProps.Getters.getCurrentSelectedEntities(state) || [];
  const selectedEntitiesObject = get(
    ebSelectedEntities,
    "selectedEntities",
    {}
  );
  const selectedEntityIds = get(
    ebSelectedEntities,
    "visibleSelectedEntities",
    []
  );

  const selectedEntities = selectedEntityIds.map(
    (id) => selectedEntitiesObject[id]
  );
  return {
    actionId,
    selectedEntities,
  };
};

export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // Refresh Query on successful action
    refreshQuery() {
      dispatch(ownProps.actions.refreshQuery());
    },
    // Close Popup Action
    onClose() {
      dispatch(ownProps.actions.closePopup());
    },
    // reset the selections on delete
    resetSelections(type, entities) {
      dispatch(ownProps.actions.removeEntitySelections(type, entities));
    },
  };
};

// Return a connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DbServerPopupContainer);
