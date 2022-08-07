import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "../header/Header";
import backIcon from "../constants/backIcon.png";
import sortIcon from "../constants/sortIcon.png";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ResourceDetails.scss";

function ResourceDetails() {
  let resourceDetailsParams = useParams();
  let [resourceDetailLoader, setResourceDetailLoader] = useState(false);
  let [resourceDetailObject, setResourceDetailObject] = useState(null);
  let [resourceItems, setResourceItems] = useState([]);
  let [numOfPages, setNumOfPages] = useState(0);
  let [pageOffest, setPageOffset] = useState(0);
  let [currentPage, setCurrentPage] = useState(0);
  let [searchItemText, setSearchItemText] = useState("");
  let [selectedItems, setSelectedItems] = useState([]);
  let navigateToCreateItem = useNavigate();
  let dropDownRef = useRef();
  let addButtonRef = useRef();
  let deleteButtonRef = useRef();
  let store = useSelector(state => state);
  let dispatch = useDispatch();
  const PER_PAGE = 6;
  useEffect(() => {
    if (store[resourceDetailsParams.resourceId]) {
      setResourceDetailObject(store[resourceDetailsParams.resourceId]);
      setResourceItems(store[resourceDetailsParams.resourceId].resource_items);
    } else {
      setResourceDetailLoader(true);
      fetch(
        `https://media-content.ccbp.in/website/react-assignment/resource/${resourceDetailsParams.resourceId}.json`
      )
        .then((res) => res.json())
        .then((json) => {
          setResourceDetailObject(json);
          setResourceItems(json.resource_items);
          dispatch({
            type: "ADD",
            payload: {
              id : resourceDetailsParams.resourceId,
              resource: json
            }
          })
          setResourceDetailLoader(false);
        })
        .catch((err) => {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setResourceDetailLoader(false);
        });
    }
  }, []);

  useEffect(() => {
    if (resourceDetailObject) {
      let newItemsArr = resourceDetailObject.resource_items.filter(
        (resourceItem) => {
          return resourceItem.title.includes(searchItemText);
        }
      );
      setResourceItems(newItemsArr);
    }
  }, [searchItemText]);

  useEffect(() => {
    if (resourceItems) {
      setNumOfPages(Math.ceil(resourceItems.length / PER_PAGE));
    }
  }, [resourceItems]);

  useEffect(() => {
    setPageOffset(currentPage * PER_PAGE);
  }, [currentPage, resourceItems]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      deleteButtonRef?.current?.classList?.add("active-delete-button");
      deleteButtonRef?.current?.classList?.remove("disabled-button");
      addButtonRef?.current?.classList?.add("disabled-button");
      addButtonRef?.current?.classList?.remove("active-add-button");
    } else {
      deleteButtonRef?.current?.classList?.add("disabled-button");
      addButtonRef?.current?.classList?.add("active-add-button");
      addButtonRef?.current?.classList?.remove("disabled-button");
      deleteButtonRef?.current?.classList?.remove("active-delete-button");
    }
  }, [selectedItems]);

  useEffect(() => {
    let allCheckBoxes = document.querySelectorAll(".checkbox");
    for (let i = 0; i < allCheckBoxes.length; i++) {
      if (selectedItems.includes(allCheckBoxes[i].id)) {
        allCheckBoxes[i].checked = true;
      }
    }
  });

  useEffect(() => {
    if (resourceDetailObject) {
      let newResourceItemArr = JSON.parse(
        JSON.stringify(resourceDetailObject.resource_items)
      );
      setResourceItems(newResourceItemArr);
      dispatch({
        type: "UPDATE",
        payload: {
          id: resourceDetailsParams.resourceId,
          resource: JSON.parse(JSON.stringify(resourceDetailObject))
        }
      })
    }
  }, [resourceDetailObject]);

  const handleSearchItem = (event) => {
    setSearchItemText(event.target.value);
  };

  const handleDropDownVisible = () => {
    if (dropDownRef.current.style.display !== "none") {
      dropDownRef.current.style.display = "none";
    } else {
      dropDownRef.current.style.display = "flex";
    }
  };

  const handleItemSelect = (event) => {
    let newSelectedItemArr = JSON.parse(JSON.stringify(selectedItems));
    if (event.target.checked) {
      newSelectedItemArr.push(event?.target?.parentElement?.parentElement?.id);
      setSelectedItems(newSelectedItemArr);
    } else {
      newSelectedItemArr = newSelectedItemArr.filter(
        (num) => num != event?.target?.parentElement?.parentElement?.id
      );
      setSelectedItems(newSelectedItemArr);
    }
  };

  const compareResourceItemsByNameAscending = (itemA, itemB) => {
    if (itemA.title > itemB.title) {
      return 1;
    } else if (itemA.title === itemB.title) {
      return 0;
    } else {
      return -1;
    }
  };

  const compareResourceItemsByNameDescending = (itemA, itemB) => {
    if (itemA.title > itemB.title) {
      return -1;
    } else if (itemA.title === itemB.title) {
      return 0;
    } else {
      return 1;
    }
  };

  const compareResourceItemsByCreatedAt = (itemA, itemB) => {
    let dateA = new Date(itemA.createdAt);
    let dateB = new Date(itemB.createdAt);
    if (dateA.getTime() > dateB.getTime()) {
      return -1;
    } else if (dateA.getTime() === dateB.getTime()) {
      return 0;
    } else {
      return 1;
    }
  };

  const handleSortItems = (event) => {
    let newSortedArr = JSON.parse(JSON.stringify(resourceItems));
    if (event.target.innerHTML === "Recently Added") {
      newSortedArr = newSortedArr.sort(compareResourceItemsByCreatedAt);
      setResourceItems(newSortedArr);
    } else if (event.target.innerHTML === "Ascending") {
      newSortedArr = newSortedArr.sort(compareResourceItemsByNameAscending);
      setResourceItems(newSortedArr);
    } else {
      newSortedArr = newSortedArr.sort(compareResourceItemsByNameDescending);
      setResourceItems(newSortedArr);
    }
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      let newResourceItemObject = JSON.parse(
        JSON.stringify(resourceDetailObject)
      );
      newResourceItemObject.resource_items =
        newResourceItemObject.resource_items.filter(
          (item) => !selectedItems.includes(item.id)
        );
      setResourceDetailObject(newResourceItemObject);
      setSelectedItems([]);
      toast.success("Deleted!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      toast.error("Select some items!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleUpdate = () => {
    setResourceDetailLoader(true);
    fetch(
      "https://media-content.ccbp.in/website/react-assignment/resource/update.json"
    )
      .then((res) => res.json())
      .then((json) => {
        if (JSON.stringify(json) === JSON.stringify({})) {
          toast.success("Updated!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error("Something Went Wrong!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
        setResourceDetailLoader(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setResourceDetailLoader(false);
      });
  };

  const handleAdd = () => {
    if (selectedItems.length === 0) {
      navigateToCreateItem(
        `/create-item-page/${resourceDetailsParams.resourceId}`
      );
    } else {
      toast.error("No Items should be selected!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <div className="resource-detail-card-parent">
      <Header />
      {resourceDetailLoader === true || resourceDetailObject === null ? (
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
          className="resource-detail-loader-box"
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <>
          <NavLink to="/resource" className="resource-detail-back-button">
            <img
              src={backIcon}
              height="12px"
              width="7px"
              className="resource-detail-back-icon"
            />
            <p>Resources</p>
          </NavLink>
          <div className="resource-detail-card">
            <div className="resource-detail-card-top">
              <img
                className="resource-detail-image"
                src={resourceDetailObject.icon_url}
              />
              <div className="resource-detail-card-top-right">
                <p className="resource-detail-card-title">
                  {resourceDetailObject.title}
                </p>
                <p className="resource-detail-card-id">
                  {resourceDetailObject.id}
                </p>
                <a
                  href={resourceDetailObject.link}
                  className="resource-detail-card-link"
                  target="_blank"
                >
                  {resourceDetailObject.link
                    .replace("https://", "")
                    .replace("http://", "")}
                </a>
              </div>
            </div>
            <div className="resource-detail-card-bottom">
              <p>{resourceDetailObject.description}</p>
            </div>
          </div>
          <button
            className="resource-detail-update-button"
            onClick={handleUpdate}
          >
            Update
          </button>
          <div className="resource-detail-table-top">
            <p className="resource-detail-table-top-left">Items</p>
            <div className="resource-detail-table-top-right">
              <input
                type="text"
                placeholder="Search"
                className="resource-detail-search-bar"
                onChange={handleSearchItem}
                value={searchItemText}
              />
              <div className="sort-items-parent">
                <div className="sort-items" onClick={handleDropDownVisible}>
                  <img src={sortIcon} />
                  <p className="sort-items-text">SORT</p>
                </div>
                <div className="sort-items-dropdown-list" ref={dropDownRef}>
                  <p
                    className="sort-items-dropdown-list-item"
                    onClick={handleSortItems}
                  >
                    Recently Added
                  </p>
                  <p
                    className="sort-items-dropdown-list-item"
                    onClick={handleSortItems}
                  >
                    Ascending
                  </p>
                  <p
                    className="sort-items-dropdown-list-item"
                    onClick={handleSortItems}
                  >
                    Descending
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="resource-item-table">
            <div className="resource-item-table-header">
              <span>
                <input type="checkbox" />
              </span>
              <span className="resource-item-table-title">TITLE</span>
              <span>DESCRIPTION</span>
              <span>LINK</span>
            </div>
            {resourceItems
              .slice(pageOffest, pageOffest + PER_PAGE)
              .map((resourceDetailObjectItem) => {
                return (
                  <div
                    key={resourceDetailObjectItem.id}
                    className={
                      selectedItems.includes(resourceDetailObjectItem.id)
                        ? "resource-item-table-body selected-item"
                        : "resource-item-table-body"
                    }
                    id={resourceDetailObjectItem.id}
                  >
                    <span>
                      <input
                        type="checkbox"
                        onClick={handleItemSelect}
                        id={resourceDetailObjectItem.id}
                        className="checkbox"
                      />
                    </span>
                    {
                      <>
                        <span className="resource-item-table-title">
                          {resourceDetailObjectItem.title}
                        </span>
                        <span>{resourceDetailObjectItem.description}</span>
                        <span>
                          <a href={resourceDetailObjectItem.link} target="_blank">
                            {resourceDetailObjectItem.link
                              .replace("https://", "")
                              .replace("http://", "")}
                          </a>
                        </span>
                      </>
                    }
                  </div>
                );
              })}
            <div className="resource-detail-footer">
              <div className="resource-detail-footer-left">
                <button
                  className="crud-button active-add-button"
                  ref={addButtonRef}
                  id="add"
                  onClick={handleAdd}
                >
                  ADD ITEM
                </button>
                <button
                  className="crud-button"
                  ref={deleteButtonRef}
                  id="delete"
                  onClick={handleDelete}
                >
                  DELETE
                </button>
              </div>
              <div className="resource-detail-footer-right">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={1}
                  marginPagesDisplayed={2}
                  pageCount={numOfPages}
                  previousLabel="<"
                  containerClassName="page-container"
                  previousLinkClassName="pre-link"
                  nextLinkClassName="next-link"
                  activeClassName="active-page"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
}

export default ResourceDetails;
