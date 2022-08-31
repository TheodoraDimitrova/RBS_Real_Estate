import React from "react";
import { Link } from "react-router-dom";
import rentImg from "../assets/jpg/rentCategoryImage.jpg";
import sellImg from "../assets/jpg/sellCategoryImage.jpg";
import ExploreSlider from "../components/ExploreSlider";
import logo from "../assets/svg/logo.png";

function Explore() {
  return (
    <div className="explore">
      <header>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          width="91px"
          height="85px"
        ></img>
        <p className="pageHeader">Welcome to RBS Real Estate</p>
      </header>
      <main>
        <ExploreSlider />
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/rent">
            <img src={rentImg} alt="rent" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Places for Rent</p>
          </Link>
          <Link to="/category/sell">
            <img src={sellImg} alt="sell" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Places for Sell</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
