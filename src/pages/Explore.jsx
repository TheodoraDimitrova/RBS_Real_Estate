import React from "react";
import { Link } from "react-router-dom";
import rentImg from "../assets/jpg/rentCategoryImage.jpg";
import sellImg from "../assets/jpg/sellCategoryImage.jpg";
import ExploreSlider from "../components/ExploreSlider";
import logo from "../assets/svg/logo.png";
import { useAuthStatus } from "../hooks/useAuthStatus";

const Explore = () => {
  const { loggedIn } = useAuthStatus();

  return (
    <div className="explore exploreHome">
      <header className="exploreHero">
        <div className="exploreHeroBrand">
          <img
            src={logo}
            className="exploreHeroLogo"
            alt="RBS Real Estate"
            width={80}
            height={80}
            decoding="async"
          />
        </div>
        <div className="exploreHeroText">
          <p className="exploreHeroEyebrow">Rent · Buy · Discover</p>
          <h1 className="exploreHeroTitle">Find your next home</h1>
          <p className="exploreHeroLead">
            Curated listings for rent and sale. Start with featured properties
            below, or open a category to browse everything we have.
          </p>
        </div>
      </header>

      <main className="exploreMain">
        <ExploreSlider />

        <section
          className="exploreSection exploreCategories"
          aria-labelledby="explore-categories-heading"
        >
          <div className="exploreSectionHead">
            <h2 id="explore-categories-heading" className="exploreSectionTitle">
              Browse by category
            </h2>
            <p className="exploreSectionSub">
              Choose whether you are looking to rent or to buy
            </p>
          </div>

          <div className="exploreCatGrid">
            <Link
              to="/category/rent"
              className="exploreCatCard exploreCatCard--rent"
            >
              <img
                src={rentImg}
                alt=""
                className="exploreCatCardImg"
                loading="lazy"
              />
              <div className="exploreCatCardScrim" aria-hidden />
              <div className="exploreCatCardContent">
                <span className="exploreCatCardKicker">Rent</span>
                <h3 className="exploreCatCardTitle">Places for rent</h3>
                <p className="exploreCatCardDesc">
                  Apartments and houses available now
                </p>
              </div>
            </Link>

            <Link
              to="/category/sell"
              className="exploreCatCard exploreCatCard--sell"
            >
              <img
                src={sellImg}
                alt=""
                className="exploreCatCardImg"
                loading="lazy"
              />
              <div className="exploreCatCardScrim" aria-hidden />
              <div className="exploreCatCardContent">
                <span className="exploreCatCardKicker">Sale</span>
                <h3 className="exploreCatCardTitle">Places for sale</h3>
                <p className="exploreCatCardDesc">
                  Properties listed for purchase
                </p>
              </div>
            </Link>
          </div>

          <nav className="exploreQuickNav" aria-label="Shortcuts">
            <Link to="/offers" className="exploreQuickNavLink">
              Special offers
            </Link>
            <span className="exploreQuickNavDot" aria-hidden>
              ·
            </span>
            <Link to="/feedback" className="exploreQuickNavLink">
              Send feedback
            </Link>
          </nav>
        </section>

        <section
          className="exploreSection exploreCta"
          aria-labelledby="explore-cta-heading"
        >
          <div className="exploreCtaCard">
            <h2 id="explore-cta-heading" className="exploreCtaTitle">
              Ready to list your property?
            </h2>
            <p className="exploreCtaLead">
              Reach thousands of potential buyers and renters across Bulgaria.
            </p>
            <div className="exploreCtaActions">
              <Link
                to={loggedIn ? "/create-ad" : "/sign-in"}
                className="exploreCtaBtn btn-grad"
              >
                {loggedIn ? "Create a Listing" : "Sign in to list"}
              </Link>
            </div>
            {!loggedIn && (
              <p className="exploreCtaHint">
                Sign in with Google takes seconds. Then you can publish photos,
                price, and details in minutes.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Explore;
