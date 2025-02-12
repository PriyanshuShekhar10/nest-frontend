// src/Home.js

import React, { useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Results from "../components/Results";
import styles from "./Home.module.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch detailed study data based on NCT ID
  const fetchStudyDetails = async (nctId) => {
    try {
      const response = await axios.get(
        `https://clinicaltrials.gov/api/v2/studies/${nctId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for NCT ID: ${nctId}`, error);
      return null;
    }
  };

  // Handle search operation
  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search query.");
      return;
    }
    setLoading(true);
    setResults([]); // Clear previous results

    try {
      // Step 1: Fetch top results from your API
      const ourApiResponse = await axios.post(
        `${process.env.REACT_APP_API}/search`,
        {
          query,
        }
      );

      const trials = ourApiResponse.data;

      if (!trials || trials.length === 0) {
        setLoading(false);
        alert("No trials found for the given query.");
        return;
      }

      // Step 2: Extract NCT numbers and fetch detailed data
      const nctIds = trials.map((trial) => trial["NCT Number"]);
      const detailedResults = await Promise.all(nctIds.map(fetchStudyDetails));

      // Filter out failed responses
      const validDetailedResults = detailedResults.filter(
        (res) => res !== null
      );

      // Step 3: Merge Distance with detailed results
      const combinedResults = validDetailedResults.map((detail, index) => ({
        ...detail,
        Distance: trials[index].Distance, // Ensure 'Distance' exists in trials
      }));

      setResults(combinedResults);
    } catch (error) {
      console.error("Error fetching trials:", error);
      alert("An error occurred while fetching the trials.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className={styles.container}>
        <h1 className={styles.title}>Discover Clinical Trials Effortlessly</h1>
        <p className={styles.subtitle}>
          Find & participate in the latest medical studies, faster and easier
          than ever.
        </p>
      </div>
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

      {/* Pass the merged results directly */}
      <Results query={query} results={results} loading={loading} />
    </div>
  );
};

export default Home;
