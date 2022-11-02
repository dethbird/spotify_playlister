import React, { useState, useEffect } from "react";

function CurrentlyPlaying() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [item, setItem] = useState([]);

    useEffect(() => {
        fetch("/api/v1/me/player/currently-playing")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setItem(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                {item.id}
            </div>
        );
    }
}
  
export default CurrentlyPlaying;
  