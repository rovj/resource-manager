import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import backIcon from "../constants/backIcon.png"
import "./ResourceDetails.css"

function ResourceDetails() {
  let resourceDetailsParams = useParams();
  let [resourceDetailLoader, setResourceDetailLoader] = useState(false);
  let [resourceDetailObject, setResourceDetailObject] = useState(null);
  useEffect(() => {
    setResourceDetailLoader(true);
    fetch(
      `https://media-content.ccbp.in/website/react-assignment/resource/${resourceDetailsParams.resourceId}.json`
    )
      .then((res) => res.json())
      .then((json) => {
        setResourceDetailObject(json);
        setResourceDetailLoader(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setResourceDetailLoader(false);
      });
  }, []);
  return (
    <div className="resource-details-card">
      <Header />
      {(resourceDetailLoader===true || resourceDetailObject===null)  ? (
        <Box
          sx={{ color: "grey.500", position:"absolute" , top: "15%" , left:"50%" , transform: "translate(-50%,-15%)" }}
          spacing={2}
          direction="row"
          className="resource-detail-loader-box"
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <>
            <NavLink to="/resource" className="resource-detail-back-button">
                <img src={backIcon} height="12px" width="7px" className="resource-detail-back-icon"/>
                <p>Resources</p>
            </NavLink>
            <div className="resource-detail-card">
                <div className="resource-detail-card-top">
                    <img className="resource-detail-image" src={resourceDetailObject.icon_url} />
                    <div className="resource-detail-card-top-right">
                        <p className="resource-detail-card-title">{resourceDetailObject.title}</p>
                        <p>{resourceDetailObject.id}</p>
                        <p>{resourceDetailObject.link}</p>
                    </div>
                </div>
                <div className="resource-detail-card-bottom">
                    <p>{resourceDetailObject.description}</p>
                    <p>Hi</p>
                </div>
            </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default ResourceDetails;
