import React, { useState, useEffect, useRef, useContext } from "react";
import search from "../assets/search.svg";
import { AuthContext } from "../App";
function SearchBar(props) {
  const [focus, setFocus] = useState(false);
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const handleScroll = () => {
    const toFocus = focus ? 'focus' : '';
    const position = window.pageYOffset;
    if (position < 300) {
      scrollRef.current.className = "search " + toFocus;
      menuRef.current.className = "menu-list";
    } else if (position >= 100) {
      scrollRef.current.className = "search fixed " + toFocus;
      menuRef.current.className = "menu-list fixed";
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
    <section className='nav'>
      <div ref={scrollRef} className={`search ${focus ? 'focus' : ''}`}>
        <input
          inputRef
          value={inputValue}
          placeholder="Search by title or by tags by prepending #..."
          onChange={handleOnChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyUp={() => props.setFilter(inputValue)}
        />
        <img
          src={search}
          className={`search-btn ${focus ? 'focus' : ''}`}
          onClick={() => props.setFilter(inputValue)}
        />
      </div>
      <ul ref={menuRef} className="menu-list">
        <li
          className={selectedFilter === "explore" ? "selected" : "not-selected"}
          onClick={() => changeSelectedFilter("explore")}
        >
          Explore
        </li>
        <li
          className={selectedFilter === "dashboard" ? "selected" : "not-selected"}
          onClick={() => changeSelectedFilter("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={selectedFilter === "contacts" ? "selected" : "not-selected"}
          onClick={() => changeSelectedFilter("contacts")}
        >
          Contacts
        </li>
      </ul>
    </section>
  );
}

export default SearchBar;
