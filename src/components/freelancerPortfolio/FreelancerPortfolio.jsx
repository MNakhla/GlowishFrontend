import { RemoveCircleRounded } from "@mui/icons-material";
import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Input,
} from "@mui/material";
import React from "react";
import addImage from "../../assets/addImage.png";
import {
  uploadPhoto,
  deleteFreelancerPortfolioImg,
} from "../../services/api/freelancerProfile.services";
import { useParams } from "react-router-dom";

const FreelancerPortfolio = ({
  handleAddFreelancerPortfolioImg,
  handleDeleteFreelancerPortfolioImg,
  freelancerPortfolioImages,
  editable,
}) => {
  const handleAdd = async (event) => {
    // console.log("uploading portfolio photo");
    await uploadPhoto(event.target.files[0])
      .then((imageURL) => {
        handleAddFreelancerPortfolioImg(imageURL);
      })
      .catch((err) => {
        alert("Error uploading photo");
      });
  };

  const { freelancerId } = useParams();

  return (
    <ImageList id="portfolio" cols={7} rowHeight={200}>
      {freelancerPortfolioImages?.map((portfolioImgUrl, index) => (
        <ImageListItem key={index}>
          <img
            height={"200px"}
            width={"200px"}
            src={portfolioImgUrl}
            loading="lazy"
            alt="portfolioImage"
          />
          {editable && (
            <IconButton
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
              onClick={async () => {
                await deleteFreelancerPortfolioImg(
                  freelancerId,
                  portfolioImgUrl
                ).then(() => {
                  handleDeleteFreelancerPortfolioImg(portfolioImgUrl);
                });
              }}
            >
              <RemoveCircleRounded />
            </IconButton>
          )}
        </ImageListItem>
      ))}
      {editable && (
        <ImageListItem>
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                // console.log("adding portfolio img");
                handleAdd(event);
                // console.log(event.target.files[0]);
              }}
            ></Input>
            <Button
              disabled={!editable}
              component="span"
              style={{ padding: "0px" }}
            >
              <img
                src={addImage}
                height={"200px"}
                width={"200px"}
                alt="addImage"
              ></img>
            </Button>
          </label>
        </ImageListItem>
      )}
    </ImageList>
  );
};

export default FreelancerPortfolio;
