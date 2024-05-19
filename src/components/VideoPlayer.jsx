import React, { forwardRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = forwardRef(({ videoId, onProgress }, ref) => {
  return (
    <div className="w-full h-[74vh] rounded-lg shadow-lg">
      <ReactPlayer
        ref={ref}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        controls
        onProgress={onProgress}
        width="100%"
        height="100%"
      />

    </div>
  );
});

export default VideoPlayer;
