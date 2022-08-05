import React from "react";
import { useNavigate } from "react-router-dom";
import "./ResourceItem.scss";

function ResourceItem(props) {
  const {
    resourceTitle,
    resourceIconUrl,
    resourceLink,
    resourceDescription,
    resourceCategory,
    resourceTag,
    resourceId
  } = props;
  const navigateToResourceDetails = useNavigate();
  const handleResourceClick = () => {
    navigateToResourceDetails(`/resource-details/${resourceId}`);
  };
  return (
    <div className="resource-card" onClick={handleResourceClick}>
      <div className="resource-card-top">
        <img src={resourceIconUrl} className="resource-card-image" />
        <div className="resource-card-top-right">
          <p className="resource-card-title">{resourceTitle}</p>
          <p className="resource-card-category">{resourceCategory}</p>
        </div>
      </div>
      <div className="resource-card-bottom">
        <a href={resourceLink} className="resource-card-link">
          {resourceLink.replace("https://", "").replace("http://", "")}
        </a>
        <p className="resource-card-description">{resourceDescription}</p>
      </div>
    </div>
  );
}

export default ResourceItem;
