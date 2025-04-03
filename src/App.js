import React, { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState("");
  const [displayedFlag, setDisplayedFlag] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  // URL to fetch the flag from
  const flagUrl =
    "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/747265";

  useEffect(() => {
    // Fetch the flag
    const fetchFlag = async () => {
      try {
        const response = await fetch(flagUrl);
        const data = await response.text();

        setFlag(data || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flag:", error);
        setFlag("Error loading flag");
        setLoading(false);
      }
    };

    fetchFlag();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!loading && flag && !animationComplete) {
      let currentIndex = 0;

      const interval = setInterval(() => {
        console.log(currentIndex);
        if (currentIndex < flag.length) {
          setDisplayedFlag((prev) => {
            console.log("prev: ", prev);
            console.log("current index char: ", flag[currentIndex]);
            return [...prev, flag[currentIndex]];
          });
          currentIndex++;
        } else {
          clearInterval(interval);
          setAnimationComplete(true);
        }
      }, 500); // 500ms delay between characters

      return () => clearInterval(interval);
    }
  }, [loading, flag, animationComplete]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {displayedFlag.map((char, index) => (
            <li key={index}>{char}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
