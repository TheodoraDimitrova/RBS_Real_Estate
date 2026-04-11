import React from "react";
import { Link, useLocation } from "react-router-dom";

import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";
import { VscFeedback } from "react-icons/vsc";

const ICON_SIZE = 26;
const ICON_ACTIVE = "#3a1c71";
const ICON_IDLE = "#9088a0";

const NAV_ITEMS = [
  { to: "/", label: "Explore", Icon: ExploreIcon },
  { to: "/offers", label: "Offers", Icon: OfferIcon },
  { to: "/profile", label: "Profile", Icon: PersonOutlineIcon },
  { to: "/feedback", label: "Feedback", feedback: true },
];

const isRouteActive = (pathname, to) => {
  if (to === "/") return pathname === "/";
  return pathname === to;
};

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <footer className="navbar">
      <nav className="navbarNav" aria-label="Main">
        <ul className="navbarListItems">
          {NAV_ITEMS.map(({ to, label, Icon, feedback }) => {
            const active = isRouteActive(pathname, to);
            const fill = active ? ICON_ACTIVE : ICON_IDLE;

            return (
              <li key={to} className="navbarListItem">
                <Link
                  to={to}
                  className={`navbarLink${active ? " navbarLink--active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="navbarIconWrap" aria-hidden>
                    {feedback ? (
                      <VscFeedback
                        className="navbarFeedbackIcon"
                        size={ICON_SIZE}
                        fill={fill}
                      />
                    ) : (
                      <Icon
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        fill={fill}
                        aria-hidden
                      />
                    )}
                  </span>
                  <span className="navbarLabel">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;
