// src/components/PcaPlot.js

import React, { useState } from "react";
import axios from "axios";
import styles from "./PcaPlot.module.css";

const PcaPlot = ({ query }) => {
  const [loading, setLoading] = useState(false);
  const [plotData, setPlotData] = useState(null);
  const [explanations, setExplanations] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle the generation of PCA plot and explanations
  const handleGenerate = async () => {
    if (!query.trim()) {
      return; // Button should be disabled, but adding a safeguard
    }

    setLoading(true);
    setError(null);
    setPlotData(null);
    setExplanations([]);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/pca_explanation`,
        {
          query: query,
        }
      );

      const data = response.data;

      if (data.error) {
        setError(data.error);
      } else {
        // data includes pca_plot_base64 and gpt_explanations
        setPlotData(data.pca_plot_base64);
        setExplanations(data.gpt_explanations);
        setIsModalOpen(true); // Open modal after successful fetch
      }
    } catch (err) {
      console.error("Error generating plot with explanations:", err);
      setError("An error occurred while generating the plot and explanations.");
    }

    setLoading(false);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setPlotData(null);
    setExplanations([]);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <h2>Result Analysis</h2>
      <button
        onClick={handleGenerate}
        disabled={!query.trim() || loading}
        className={styles.generateButton}
      >
        {loading ? "Generating..." : "Generate Plot & Explanation"}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {/* Modal Implementation */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>

            {/* Flex layout: left side for the plot, right side for the explanations */}
            <div className={styles.modalBody}>
              <div className={styles.leftSection}>
                <h3>Resulting PCA Plot</h3>
                {plotData ? (
                  <img
                    src={`data:image/png;base64,${plotData}`}
                    alt="PCA Plot"
                    className={styles.plotImage}
                  />
                ) : (
                  <p>No plot data available.</p>
                )}
              </div>

              <div className={styles.rightSection}>
                <h3>AI Analysis</h3>
                {explanations.length > 0 ? (
                  explanations.map((item, idx) => (
                    <div
                      key={item["NCT Number"]}
                      className={styles.explanationItem}
                    >
                      <strong>
                        {idx + 1}. NCT ID: {item["NCT Number"]}
                      </strong>
                      <p>{item["GPT Comment"]}</p>
                    </div>
                  ))
                ) : (
                  <p>No AI Analysis available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PcaPlot;
