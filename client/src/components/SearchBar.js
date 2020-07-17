import React, { useState, useEffect, useRef, useContext } from "react";
import search from "../assets/search.svg";
import { AuthContext } from "../App";
function SearchBar(props) {
  const scrollRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const handleScroll = () => {
    const position = window.pageYOffset;
    if (position < 300) {
      scrollRef.current.className = "search";
    } else if (position >= 100) {
      scrollRef.current.className = "search fixed";
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { state, dispatch } = useContext(AuthContext);
  const handleOnChange = (e) => {
    // TODO: perhaps break at new tags? actually use query?
    setInputValue(e.target.value);
  };

  const { selectedFilter } = state;
  const changeSelectedFilter = (newFilter) => {
    dispatch({
      type: "FILTER",
      payload: { selectedFilter: newFilter },
    });
  };

  return (
    <section>
      <div ref={scrollRef} className="search">
        <input
          value={inputValue}
          placeholder="Search by title or by tags by prepending #..."
          onChange={handleOnChange}
          onKeyUp={() => props.setFilter(inputValue)}
        />
        <img
          src={search}
          className="search-btn"
          onClick={() => props.setFilter(inputValue)}
        />
      </div>
      <ul className="menu-list">
        <li
          className={selectedFilter === "explore" ? "" : "not-selected"}
          onClick={() => changeSelectedFilter("explore")}
        >
          Explore
        </li>
        <li
          className={selectedFilter === "dashboard" ? "" : "not-selected"}
          onClick={() => changeSelectedFilter("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={selectedFilter === "contacts" ? "" : "not-selected"}
          onClick={() => changeSelectedFilter("contacts")}
        >
          Contacts
        </li>
      </ul>
    </section>
  );
}

export default SearchBar;
