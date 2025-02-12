// src/components/Results.js

import React from "react";
import {
  FaBookmark,
  FaQuoteRight,
  FaShareAlt,
  FaDownload,
} from "react-icons/fa";
import styles from "./Results.module.css";
import PcaPlot from "./PcaPlot"; // Ensure correct path

// Helper function to normalize distance between 0-100%
const normalizeDistance = (distance, minDist, maxDist) => {
  if (maxDist === minDist) return 100; // Handle case where all distances are equal
  return ((maxDist - distance) / (maxDist - minDist)) * 100;
};

// Helper function to determine bar color based on normalized distance
const getDistanceColor = (normalized) => {
  if (normalized > 75) return "#4caf50"; // Green
  if (normalized > 50) return "#ffeb3b"; // Yellow
  return "#f44336"; // Red
};

const Results = ({ query, results, loading, explainabilityNote }) => {
  if (results.length === 0) {
    return null; // Or some message indicating no results
  }

  // Get distance values for normalization
  const distances = results.map((result) => result.Distance);
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);

  const exportCSV = () => {
    if (!results || results.length === 0) return;

    const csvHeader = [
      "NCT ID",
      "Brief Title",
      "Sponsor",
      "Status",
      "Start Date",
      "Completion Date",
      "Brief Summary",
      "Distance",
    ];

    const csvRows = results
      .map((result) => {
        const study = result?.protocolSection || {};
        const identification = study?.identificationModule || {};
        const status = study?.statusModule || {};
        const description = study?.descriptionModule || {};

        return [
          identification.nctId || "N/A",
          identification.briefTitle || "No Title Available",
          study?.sponsorCollaboratorsModule?.leadSponsor?.name || "N/A",
          status.overallStatus || "Unknown",
          status.startDateStruct?.date || "N/A",
          status.completionDateStruct?.date || "N/A",
          description.briefSummary || "No summary available.",
          result?.Distance?.toFixed(10) || "N/A",
        ];
      })
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      );

    const csvContent = [csvHeader.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "results.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={styles.container}>
      <PcaPlot query={query} /> {/* Pass the query prop here */}
      {loading && <p className={styles.loadingText}>Loading results...</p>}
      {!loading && results.length > 0 && explainabilityNote && (
        <div className={styles.explanationBox}>
          <p>{explainabilityNote}</p>
        </div>
      )}
      {!loading && results.length > 0 && (
        <div>
          <button
            onClick={exportCSV}
            className={styles.exportButton}
            title="Export CSV"
          >
            <FaDownload className={styles.exportIcon} />
            <span className={styles.exportText}>Download CSV</span>
          </button>
          <h3>Results</h3>
          <div className={styles.resultsWrapper}>
            {results.map((result, index) => {
              const study = result?.protocolSection || {};
              const identification = study?.identificationModule || {};
              const status = study?.statusModule || {};
              const description = study?.descriptionModule || {};
              const normalized = normalizeDistance(
                result.Distance,
                minDistance,
                maxDistance
              );

              const barColor = getDistanceColor(normalized);

              return (
                <div key={index} className={styles.resultItem}>
                  <div className={styles.header}>
                    <span className={styles.indexBadge}>{index + 1}</span>
                    <div className={styles.flagsContainer}>
                      <span className={styles.sponsorFlag}>
                        Sponsor:{" "}
                        {study?.sponsorCollaboratorsModule?.leadSponsor?.name ||
                          "N/A"}
                      </span>
                      <span
                        className={`${styles.statusFlag} ${
                          status.overallStatus === "COMPLETED"
                            ? styles.completed
                            : styles.inProgress
                        }`}
                      >
                        Status: {status.overallStatus || "Unknown"}
                      </span>
                      <span className={styles.durationFlag}>
                        Duration: {status.startDateStruct?.date || "N/A"} -{" "}
                        {status.completionDateStruct?.date || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.separator}></div>

                  <h2 className={styles.titleLink}>
                    <a
                      href={`https://clinicaltrials.gov/ct2/show/${identification.nctId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.titleLink}
                    >
                      {identification.briefTitle || "No Title Available"}
                    </a>
                  </h2>

                  <p className={styles.nctId}>
                    {identification.nctId || "N/A"}
                  </p>

                  <ExpandableText
                    text={description.briefSummary || "No summary available."}
                  />

                  <div
                    className={styles.distanceMeter}
                    title={`Distance: ${result.Distance.toFixed(3)}`}
                  >
                    <div className={styles.meterBar}>
                      <div
                        className={styles.meterFill}
                        style={{
                          width: `${normalized}%`,
                          backgroundColor: barColor,
                        }}
                      ></div>
                    </div>
                    <span className={styles.distanceValue}>
                      L2 Distance : {result.Distance?.toFixed(3)}
                    </span>
                  </div>

                  <div className={styles.iconContainer}>
                    <FaBookmark />
                    <FaQuoteRight />
                    <FaShareAlt />
                  </div>

                  {index !== results.length - 1 && <hr />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ExpandableText Component
const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const words = text.split(" ");
  const previewText =
    words.slice(0, 30).join(" ") + (words.length > 30 ? "..." : "");

  return (
    <p className={styles.highlightBox}>
      {isExpanded ? text : previewText}{" "}
      {words.length > 30 && (
        <span
          className={styles.expandToggle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </span>
      )}
    </p>
  );
};

export default Results;
