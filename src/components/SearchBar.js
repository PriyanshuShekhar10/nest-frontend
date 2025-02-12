// SearchBar.jsx
import React, { useState } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
} from "react-icons/fa";
import styles from "./SearchBar.module.css";

const SearchBar = ({ query, setQuery, onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toggleOption, setToggleOption] = useState("Ada v2"); // Toggle state

  const [studyTitle, setStudyTitle] = useState("");
  const [primaryOutcome, setPrimaryOutcome] = useState("");
  const [secondaryOutcome, setSecondaryOutcome] = useState("");
  const [criteria, setCriteria] = useState("");

  const handleNctIdBlur = async (e) => {
    const nctId = e.target.value.trim();
    if (!nctId) return;

    try {
      const response = await fetch(
        `https://clinicaltrials.gov/api/v2/studies/${nctId}`
      );
      const data = await response.json();
      const briefTitle = data.protocolSection?.identificationModule?.briefTitle;

      if (briefTitle) {
        setQuery(briefTitle);
      }
    } catch (error) {
      console.error("Error fetching study title:", error);
    }
  };

  const toggleForm = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAdvancedSearch = () => {
    const combined = [studyTitle, primaryOutcome, secondaryOutcome, criteria]
      .filter(Boolean)
      .join(" ");
    setQuery(combined);
    setIsExpanded(false);
    onSearch();
  };

  const handleQuickSearch = () => {
    setIsExpanded(false);
    onSearch();
  };

  const handleToggleClick = (option) => {
    setToggleOption(option);
    // Currently non-functional. Future implementation can use this state.
  };

  // Determine tooltip content based on the toggle option
  const getTooltipContent = (option) => {
    if (option === "Ada v2") {
      return "Faster, provides results quickly, requires less hardware.";
    } else if (option === "BioBert") {
      return "Open source, requires GPU, slower processing.";
    }
    return "";
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.togglecontainerdiv}>
        {/* Toggle Switch with Individual Info Icons */}
        <div className={styles.toggleContainer}>
          {/* Ada v2 Toggle Button */}
          <button
            className={`${styles.toggleButton} ${
              toggleOption === "Ada v2" ? styles.active : ""
            }`}
            onClick={() => handleToggleClick("Ada v2")}
            aria-pressed={toggleOption === "Ada v2"}
          >
            Ada v2
            {/* Info Icon with Tooltip */}
            <div className={styles.tooltipContainer}>
              <FaInfoCircle className={styles.infoIcon} />
              <span className={styles.tooltipText}>
                {getTooltipContent("Ada v2")}
              </span>
            </div>
          </button>

          {/* BioBert Toggle Button */}
          <button
            className={`${styles.toggleButton} ${
              toggleOption === "BioBert" ? styles.active : ""
            }`}
            onClick={() => handleToggleClick("BioBert")}
            aria-pressed={toggleOption === "BioBert"}
          >
            BioBert
            {/* Info Icon with Tooltip */}
            <div className={styles.tooltipContainer}>
              <FaInfoCircle className={styles.infoIcon} />
              <span className={styles.tooltipText}>
                {getTooltipContent("BioBert")}
              </span>
            </div>
          </button>
        </div>
      </div>
      {/* Search Bar */}
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Look up relevant clinical trials..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchBarInput}
        />
        <button onClick={handleQuickSearch} className={styles.searchBarButton}>
          <FaSearch className={styles.searchIcon} />
        </button>
      </div>
      {/* NCT ID Form */}
      <form className={styles.nctForm}>
        <div className={styles.formGroup}>
          <input
            type="text"
            id="nctId"
            name="nctId"
            placeholder="Enter the NCT ID to fetch Study title"
            onBlur={handleNctIdBlur}
            className={styles.inputField}
          />
        </div>
      </form>
      {/* Advanced Search Toggle */}
      <button onClick={toggleForm} className={styles.toggleBtn}>
        Advanced Search{" "}
        {isExpanded ? (
          <FaChevronUp className={styles.chevronIcon} />
        ) : (
          <FaChevronDown className={styles.chevronIcon} />
        )}
      </button>
      {/* Advanced Search Section */}
      {isExpanded && (
        <div className={styles.advancedSection}>
          <div className={styles.formGroup}>
            <label htmlFor="study-title" className={styles.label}>
              Study Title
            </label>
            <input
              type="text"
              id="study-title"
              name="study-title"
              placeholder="Enter study title"
              className={styles.inputField}
              value={studyTitle}
              onChange={(e) => setStudyTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="primary-outcome" className={styles.label}>
              Primary Outcome Measure
            </label>
            <input
              type="text"
              id="primary-outcome"
              name="primary-outcome"
              placeholder="Enter primary outcome measure"
              className={styles.inputField}
              value={primaryOutcome}
              onChange={(e) => setPrimaryOutcome(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="secondary-outcome" className={styles.label}>
              Secondary Outcome Measure
            </label>
            <input
              type="text"
              id="secondary-outcome"
              name="secondary-outcome"
              placeholder="Enter secondary outcome measure"
              className={styles.inputField}
              value={secondaryOutcome}
              onChange={(e) => setSecondaryOutcome(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="criteria" className={styles.label}>
              Criteria
            </label>
            <textarea
              id="criteria"
              name="criteria"
              placeholder="Enter criteria"
              rows="4"
              className={styles.textarea}
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            ></textarea>
          </div>

          <button
            type="button"
            onClick={handleAdvancedSearch}
            className={styles.searchButton}
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
