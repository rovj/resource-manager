import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Box from '@mui/material/Box';
import CircularProgress from "@mui/material/CircularProgress";
import Header from "../header/Header";
import "./Resource.scss";
import "react-toastify/dist/ReactToastify.css";
import ResourceItem from "../resourceItem/ResourceItem";

function Resource() {
  let [activeTab, setActiveTab] = useState("tab-box-resources");
  let resourceRef = useRef();
  let requestRef = useRef();
  let userRef = useRef();
  let [resourceLoader, setResourceLoader] = useState(false);
  let [resourceList, setResourceList] = useState([]);
  let [resourceSearchItem, setResourceSearchItem] = useState("");
  useEffect(() => {
    if (activeTab === "tab-box-resources") {
      resourceRef?.current?.classList.add("active-tab");
    } else if (activeTab === "tab-box-requests") {
      requestRef?.current?.classList.add("active-tab");
    } else {
      userRef?.current?.classList.add("active-tab");
    }
    return () => {
      resourceRef?.current?.classList.remove("active-tab");
      requestRef?.current?.classList.remove("active-tab");
      userRef?.current?.classList.remove("active-tab");
    };
  }, [activeTab]);
  useEffect(() => {
    setResourceLoader(true);
    fetch(
      "https://media-content.ccbp.in/website/react-assignment/resources.json"
    )
      .then((res) => res.json())
      .then((json) => {
        setResourceList(json);
        setResourceLoader(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setResourceLoader(false);
      });
  }, []);
  const handleTabClick = (event) => {
    setActiveTab(event.target.classList[1]);
  };
  const handleSearchChange = (event) => {
    setResourceSearchItem(event.target.value);
  };
  return (
    <div className="resource-container">
      <Header />

      <div className="tab-box">
        <div
          onClick={handleTabClick}
          ref={resourceRef}
          className="tab-box-element tab-box-resources"
        >
          Resources
        </div>
        <div
          onClick={handleTabClick}
          ref={requestRef}
          className="tab-box-element tab-box-requests"
        >
          Requests
        </div>
        <div
          onClick={handleTabClick}
          ref={userRef}
          className="tab-box-element tab-box-users"
        >
          Users
        </div>
      </div>
      <div className="resource-area">
        <input
          type="text"
          className="resource-search-bar"
          placeholder="Search"
          value={resourceSearchItem}
          onChange={handleSearchChange}
        />
        <div className="all-resources">
          { resourceLoader===true ? (
            
              <Box sx={{ color: "grey.500", width:"100%", textAlign: "center" }} spacing={2} direction="row">
                <CircularProgress color="inherit" />
              </Box>
            
          ) : (
            <>
              {resourceList
                .filter((resourceItem) => {
                  if (activeTab === "tab-box-resources") {
                    return true;
                  } else if (activeTab === "tab-box-requests") {
                    return resourceItem.tag === "request";
                  } else {
                    return resourceItem.tag === "user";
                  }
                })
                .filter((resourceItem) => {
                  if (resourceSearchItem !== "") {
                    return resourceItem.title.includes(resourceSearchItem);
                  } else {
                    return true;
                  }
                })
                .map((resourceItem) => {
                  return (
                    <ResourceItem
                      key={resourceItem?.id}
                      resourceTitle={resourceItem?.title}
                      resourceIconUrl={resourceItem?.icon_url}
                      resourceLink={resourceItem?.link}
                      resourceDescription={resourceItem?.description}
                      resourceCategory={resourceItem?.category}
                      resourceTag={resourceItem?.tag}
                      resourceId={resourceItem?.id}
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Resource;
