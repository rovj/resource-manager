import React, { useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "../header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import itemImage from "../constants/itemImage.png";
import backIcon from "../constants/backIcon.png";
import "./CreateItem.scss";

function CreateItem() {
  let [createItemLoader, setCreateItemLoader] = useState(false);
  let [itemName, setItemName] = useState("");
  let [itemLink, setItemLink] = useState("");
  let [resourceName, setResourceName] = useState("");
  let [itemDescription, setItemDescription] = useState("");
  let store = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let params = useParams();

  const handleNameChange = (event) => {
    setItemName(event.target.value);
  };
  const handleLinkChange = (event) => {
    setItemLink(event.target.value);
  };
  const handleResourceNameChange = (event) => {
    setResourceName(event.target.value);
  };
  const handleItemDescriptionChange = (event) => {
    setItemDescription(event.target.value);
  };
  const handleSubmit = () => {
    if (
      itemName === "" ||
      itemLink === "" ||
      resourceName === "" ||
      itemDescription === ""
    ) {
      toast.error("Please fill all details!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      if (
        itemName.length > 25 ||
        itemLink.length > 25 ||
        itemDescription.length > 40
      ) {
        toast.error("Character limit exceeded!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        if (resourceName !== store[params.resourceId].title) {
          toast.error("Give proper resource name!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          if (
            !isNaN(itemName) ||
            !isNaN(itemLink) ||
            !isNaN(resourceName) ||
            !isNaN(itemDescription)
          ) {
            toast.error("Please put proper values!", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          } else {
            let current = new Date();
            let item = {
              createdAt: current.toISOString(),
              title: itemName,
              description: itemDescription,
              link: itemLink,
              id: (store[params.resourceId].resource_items.length + 1).toString()
            };
            let newResourceObject = JSON.parse(
              JSON.stringify(store[params.resourceId])
            );
            newResourceObject.resource_items.push(item);
            dispatch({
              type: "UPDATE",
              payload: {
                id: params.resourceId,
                resource: newResourceObject,
              },
            });
            setCreateItemLoader(true);
            fetch(
              "https://media-content.ccbp.in/website/react-assignment/add_resource.json"
            )
              .then((res) => res.json())
              .then((json) => {
                if (JSON.stringify(json) === JSON.stringify({})) {
                  toast.success("Added!", {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                } else {
                  toast.error("Something Went Wrong!", {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                }
                setCreateItemLoader(false);
                navigate(`/resource-details/${params.resourceId}`);
              })
              .catch((err) => {
                toast.error(err.message, {
                  position: toast.POSITION.BOTTOM_CENTER,
                });
                setCreateItemLoader(false);
              });
          }
        }
      }
    }
  };
  return (
    <div className="create-item-container">
      <Header />
      {createItemLoader === true ? (
        <Box
          sx={{
            color: "grey.500",
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translate(-50%,-15%)",
          }}
          spacing={2}
          direction="row"
          className=""
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <div className="create-item-wrapper">
          <div className="create-item-wrapper-left">
            <NavLink
              to={`/resource-details/${params.resourceId}`}
              className="create-item-back-button"
            >
              <img src={backIcon} height="12px" width="7px" className="" />
              <p>Users</p>
            </NavLink>
            <div className="item-form">
              <p className="form-title">Item Details</p>
              <div className="input-fields">
                <div className="field">
                  <p className="field-label">ITEM NAME</p>
                  <input
                    className="input-field"
                    type="text"
                    value={itemName}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="field">
                  <p className="field-label">LINK</p>
                  <input
                    className="input-field"
                    type="text"
                    style={{ color: "#0B69FF" }}
                    value={itemLink}
                    onChange={handleLinkChange}
                  />
                </div>
                <div className="field">
                  <p className="field-label">RESOURCE NAME </p>
                  <input
                    className="input-field"
                    type="text"
                    value={resourceName}
                    onChange={handleResourceNameChange}
                  />
                </div>
                <div className="field">
                  <p className="field-label">DESCRIPTION </p>
                  <textarea
                    value={itemDescription}
                    onChange={handleItemDescriptionChange}
                  />
                </div>
              </div>
              <button onClick={handleSubmit}>CREATE</button>
            </div>
          </div>
          <div className="create-item-wrapper-right">
            <img src={itemImage} className="create-item-wrapper-right-img" />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default CreateItem;
