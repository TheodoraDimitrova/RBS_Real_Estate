import React from "react";
import { Link } from "react-router-dom";
import rentImg from "../assets/jpg/rentCategoryImage.jpg";
import sellImg from "../assets/jpg/sellCategoryImage.jpg";
import ExploreSlider from "../components/ExploreSlider";

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
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
