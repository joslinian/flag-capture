import React, { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState("");
  const [displayedChars, setDisplayedChars] = useState(0);
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
      let timer = null;

      const startAnimation = () => {
        timer = setInterval(() => {
          setDisplayedChars((prev) => {
            const next = prev + 1;
            console.log(
              `Displaying ${next} characters: ${flag.substring(0, next)}`
            );

            if (next >= flag.length) {
              clearInterval(timer);
              setAnimationComplete(true);
            }

            return next;
          });
        }, 500);
      };

      startAnimation();

      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [loading, flag, animationComplete]);

  // Convert the substring to an array of characters for rendering
  const displayedFlagArray = flag.substring(0, displayedChars).split("");

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {displayedFlagArray.map((char, index) => (
            <li key={index}>{char}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
