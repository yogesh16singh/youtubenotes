import React, { useState, useEffect, useRef } from "react";
import VideoPlayer from "./components/VideoPlayer";
import NotesList from "./components/NotesList";
import AddNote from "./components/AddNote";
import "./index.css";
import Header from "./components/Header";
import { fetchVideoDetails } from "./utils/fetchVideoDetails";

const App = () => {
  const [videoId, setVideoId] = useState("HMJk0xWlAF0"); // Example video ID
  const [inputVideoId, setInputVideoId] = useState(videoId);
  const [notes, setNotes] = useState([]);
  const [showDescr, setShowDescr] = useState(false);
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    description: "",
  });
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem(videoId);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes([]);
    }
    const fetchDetails = async () => {
      try {
        const details = await fetchVideoDetails(videoId);
        setVideoDetails(details);
      } catch (error) {
        console.error("Error fetching video details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [videoId]);

  const handleProgress = (state) => {
    setCurrentTimestamp(Math.floor(state.playedSeconds));
  };

  const handleAddNote = (note) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
  };

  const handleDeleteNote = (date) => {
    const updatedNotes = notes.filter((note) => note.date !== date);
    setNotes(updatedNotes);
    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
  };

  const handleEditNote = (date, content) => {
    const updatedNotes = notes.map((note) =>
      note.date === date ? { ...note, content } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
  };

  const handleJumpToTimestamp = (timestamp) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timestamp, "seconds");
    }
  };

  const handleVideoIdChange = () => {
    setVideoId(inputVideoId);
  };

  return (
    <div className="container mx-auto p-10">
      {/* <Header/> */}
      <div className="mb-6 flex flex-col md:flex-row justify-center items-center">
        <div className="mx-2 flex gap-2 flex-row">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAA/1BMVEX///8TZ6XyAAD/vgD///38///vAAAAYqNqlL7/8db/vAD//f8TZ6P/uQD//vn9wQD7trYAYaVSiLb/+e0AWZ7m7PP+9vb97MLo8fb6//v99t789dP978w+f7b+x0n+xT3957gpb6gzeLIAUpv/wzDxl5f2fXjR3+pyoMf+9+X+1nz4qqr5lJvG1+QARpW4zeH67Lb85+LyXmqOrcudutSDpclehLBaj7Z0mLrT6e61ytb+4J393pP92Yj90mT90VcoZ5X76ar7zkP8yCj8z23+4an2yAAOX5T01tLyubP3Hh73bWv3QUL1jIz4Xlr3ysr2c3v6T1DvLy7dAAD+opnU8rhJAAAONUlEQVR4nO1cC1fiSBYOUEUwgcIQHgkjKmqL6DC0A/TYo7bb3bpjq63TPfv/f8veW0kgL7AqQd09p74jiojhfrnPel1NU1BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQeEEQSgAapTTb/4f/DS/jXW0tosmDEAafrpG8cF3CmbC3JAMCaISt8XqOs76LyQK04oyms0pefAD8UZlMRwOHvAELwj/UGZ/19qo6wLIsfQUsD/yp/0JBbzb3AVa/VzmajkeDVstxqPYmZMDn2bRXKOh6YRWq+A58SxUwf6XZbOpNvdeoTJCE4zjmW5BYUGHaeE8vrGbiY8HXQl00C73KbPwnkjBNil7/Vjw8UBDgCAym6t3plapB6M39334DFg2wJyCBHFwMYowwRt+aD9E+9uGGcy7pZLhVgWt4btE7m/75EWwJQh/DQAzfTCQDCQoDIiVvRIZQzHUjMLA4iyo3Or3ANRHY02Q6bgX/SYKfxLshkV89uEHaApL8CePBn7/AUH9z7gwukPseQNJn5M+CnlSI7pmUtb8Prn00GbcWSUP4Q00TdGdqDAUHDaLeQI9MM7HKoLzS8F6j1Gb5jRMz9LjfrKa6vtVs9mejloNJHA0K7ixjMvePEV9g9CYkp/ESh9n2cKOze35xefnpant7+9PxjW1S6uZlAxcf9JppjgL55l+TkScTc128y+gVwsbgVTbAHlTBmL3Ref/5/Pzy+urqoFQ3jNochlGvw69f3oMK84K0KlY1xcx0vT/1rACdytR4AWpyAefVG/9/fA98Z57kKDeiu9Hp7O5egPDbIHzJmEsOj1IJfjfwB/wFHvAa/KhddVwtZ4Kik5TsUtWt/syJXJiLjsZCMGbw8pFLz0UfbmxsbXXe35xfXh5/2j74+rVeL3myg8z1Uh1lRrH9n9GnHuCd9Qs7Z2U47qe4i15ojDUSGQlgGvFlHw673S3A7s35zeX19fb2zsGBEbYcjwQIbCwDCB8ng+o6tnNxASNLyZN6ZYBBO+wehNjDX7jdXxwfIwMR7Ozs4CPAQQhGyTAiXDj142F2KoRMkwkGrGzW4mE/ambMBo10hwg7UFCXf/Pwi4ct+IqgE2DXxw3i8vrTAVCY64irq4RssnkNSDtoWCmBDN3lpZM4Jd33xzvAob7QED45t7OV2pTRcVp+QRt7YTK8TKd25xjZRPzmoONm+mwKYTmZYvTGgLw0FwCUppAnh+dfjahmStfDTANt4o5SAll/zNX88mwApsne79Tq89iGxIwbN9PlnElUMVX8mrg8Tb4wGX6/oKig2u4BGJpva5hsjJ1uFtVAIWPFrUxvtLys/0pwTfczFjShdGqcswy3Etw/WsboVb065aOCVwOYlHsJiqktyNS2uxlc1pnES7Kq1XBed2SFgxv271q0IOhkqJ9bjXj2/0ufCGoYBsprmWDjgfN9LVKpGcc2la6gB/1Y+q/qe63n/80TQlsPGe9aX2oRMjtgZ7JXH+mx+YuqdSbqerffcKi1HhC6a0Trzg6RjUHmOJ4xq9ZUlMzT3bu2vNhLwOhBhEztvO1K3SkYa2GWidLpO5qYes3Ncvn+lOL408wfMQj9HLGz2hWTIgPFkXPUjJmZ3tME1Ytkig+bMG4H5A3lpmt2I1ZW+2pLuQwI7fyRIHMkWi2bm8Vy+Z+7720NFJPXd0yXsJ3I4KZuS00IUKY5jXgAQJcR1kyxWCwXH0/pOqb8GD2ORoCunJkBmZ4VJzPCaRgRgGaAC+KE5l5OYkDmPOw09dKWXLFJSGvPio1mmi0ZMysWOaHDtgl3IKd27K0azuEEZlbrmFIXRDLxkZklPMKckwE83IIH5/EbAhlrGCMjl2fSyOgOEawyQ5opl+++tWmecgBDiB0JAGshQ0WHmCEyyOfwNI/fYH0WJ2PKXBDqhZxkkEcxMLaHJ7QzknH4AB9q42TTgsyGpGLSyQgnTZ9MoJ3iyalowk2FHR4ESJNZohnxCmARAcqcz9+neYq1fGRAM8l1jGxkkA44zo9vOdjkIoPzTAkyupZVM/xx9+6UL8dkKQmiZAw5MuYyMqJVczGsmQD3T+2M1Y0dqWZKG1LLaEgmuZaRl0z5AeNAlgyai0yqmRU00eHqMjLFu8PbTHaWiwxZRkZiCJAkg5Hg/gm0LpVw8COHkarZkJtswmhWCA8BcNtIQfiehmuzOB5O2ppUKe2TCddmcpOaQWjOSuZkOZkymJors/8OF0m7NVxtmpORmzwPzCxCpipFZgkbyDjFH5syY4L/ATLLVMMT6M9fT2lk44YAmcU6p2HImpnW0gvxeTPxAHBSXm5nPKrd3+JykiYSpn0yixBgGJKaSSPTXx+ZYvHnJqUmbh3IREa6NrOyk2m/Ky91msB17g45m2xkpKNZGhnB2qz9bqnPBG4Dj4dbTVQzw7xkEjlTUjMrrYx/vzuhuALznOPAh26EZ2eMki03NqIxMhjN1kVmgX/uMQY8N3+VIFN/ZTKrzCzkOMWfENWei2hpZGS4vJJmgM8//2HPSZZCRorLMjLCAUCUDNCBlLN6zyL8KZdmEgHAIyM6KdH+tSzB5uHJpSvcBj9zK0ZGeno2HxlBJpwNDKhXLOOsgYzWasbJ7L0EGUw5RVyZWmo5uclgoZmXjCAfIHP38H3FnOf6yRQ4GeFoJqoZPnPz8/vTqgNGxHTpesnocmS+C6ul/PPwWxtS5yoy7GXIiJrZoRAZtLD7kzYOBlbE2hcjI6qZw+KzPsNnbR/53BNduUtqDWS0QcJnehJkngsAfI3wx7tbvm949Y4vnMvprJ1MQxNdbHqWTNnz+zYlz4uF5xwiZErrIrMWzfDq4PCprbki6+reXqA1k7EawkdfniVTvN/EWXTiCuxPwpWz3RcgIzo7k05m8cKPk1t+MkhofyRlmvs5TkZqH0BeMsXUQrPMi5eHd7dtibIXOLuXETIlyaqZkhcg470CziK1EoDjg0+RaHZgS20sWEpGOM+kz5sXy49PbZdQmdViCGZ2PbLavG1LbWrArfN5otnfcS7+JMaPb22TH7SRsXmbdqNkjuX2z6aSqQhvNW//nvR+sLufJ3aGdTMIeRfR/WY3RHa/2WC/Gicjrpnf4y5T9vc2ZCDDTPo1TkZqy0cqGQkzS5CBcHyrkWfnLtKxVYpOm22sgcweREnBciapmVu+8yzLhiBCtyOntiCYMdkAMIqTkVgGbD+Wg2lLnj1x6jITmAuJdau2WJox4OlnW27bCobm/TgX8b0zITI4Rf4981kxQphpfg3FsrpRL+0yuVMihNJENCtYA+Gq+bE4Z3P3923mrhswlqHsplZfbDkHXlc4bS5HRkvMAeAeTUEPBjK+q9w9fsPp5Kx7gMDIOnU8/bgws9oNo5rUXkkcaSYaGegz0SVvMDMeje8eN01+1DyTZlwCg8wungZa7M4q1b9ueKe4JMgQghtOoyFA74lWIe0f6Pp3P95hFZZZK3gCf+PKiJ4/xeMzkqCMOpWEZgoj4QCAa0nfbwXXxpbIAMFsa7sU4/KlK31BSG90Enca8bMAoJmfh0/Mqyczbzal9u4XI3ow2DBu5M/SI5lxfF9zv/mHIxac24/3mzBkIXxkKmKa3vnueX8e/k/2L5d43iyiGuN4mG2j9KAacxr9r8JYLG+2v53KhOM5B2wnQHlrAzbsXBzU4se161cbWqaTiKTVSJ7SrAhufqNyIxaXt07iZSglDA/Y3xwf1I2Yv9SNnQ7LtvkucbKxUNUL/bHYxYj02QxQC5LYvTnnx+xLNSNxjt7Y2XVpttO7UJ0lW+boFUfoaiQ06+K1Cpg3PdC8blyh99rDjS1O4nr7C+rDOzSL5xnr3jnTkvd0ezfUNUGWTSvlmHZ1KnjTQzGMf77fwyTom4WplA27niauQRW8XQOeKuUL/kawJQsPnPIgYBjXWwQ74GTbF0npNOVoc28gezV0bNcngGEBnWKrw80pRIL3NEjpcsBVBG+6uhnmOZUHI+fE1mbAUUueDJ9Phlg17G75mtjhrTMM7+77prWkbUMNtLVz0WW8IshOJhECUDXWxJEMjiDFsHNzcXn96Qo0gRzmjSeCpgXLqKCB1T+d73ZtyvxclJUMGfWTmrH6Uwf3nUpMfRHb3siBIVdIviM4hEfnRASAr4nsxMRbt87ydhONGvEmGlUwtOrEkej847/xFToirBaD0GlqFzC9MZBqCpA9P6wPaGhnzUKshxZv/1WYObz+YPNgScPQAgLedTDHeK0m8QdNwP+L/8xLSfPX1kho8KGZ2tRM148GgaRJ8HySAL6bMa9H1XLELro+f4ObP9qzCqldtKxmvzLGPoVzxG/4ykVkYRHWRwbMaFpIdJ/wzU239vebASL9G/sx9OZohFGpNPx2lEdzzGazyWTGv0+no5GzPjMjOIc57qc0a+Ov6CkWyMkEfQ69X+BNXitKa4HmAnhH8GFZ1T6Qrcwm2Jty0HK87pRrjRsE2CztBhhVldd5MogXVZ9NIehJqev+PnyAl8BAZZUzlB2ERzNNfPS6AYHlYyN+mjYVC0Xpc/IeQ0/y/l4PzOpoNh2D9B8/Ri0IS6+MoxUZYNk+6TdXtZ3UQzrAwK17oqPRHIHVBLc+dM0gYIXi8Xzc84LAOTymDc729PBgLeTt89v+gfv0GXou3PuWF99C94QssmcoECMjf8jzojzmcmC2H80+9PrB/ef3HaWvHJ1h3Bl7Lhuy+3lxmBAURY82els8XgV80sgdTCezMy48jzcDHm48gdbY+vjlQRITxnyw5H/zDP9tJJMH0cLG7stOfZelizrk/wKB9Qc/FrLPPfmtGnwrKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKLw+/guCulvjfz/Z2gAAAABJRU5ErkJggg=="
            alt="logo"
            className="w-16 h-12 rounded-lg"
          />
          <h2 className="text-blue-500 my-4 font-bold text-xl md:mr-20">
            YoutubeNotes
          </h2>
        </div>
        <div className="text-lg text-black font-semibold">
          Enter Youtube Video ID:{" "}
        </div>
        <input
          type="text"
          value={inputVideoId}
          onChange={(e) => setInputVideoId(e.target.value)}
          className="p-2 border rounded m-3 text-black"
          placeholder="Enter the youtube videoId"
        />
        <button
          onClick={handleVideoIdChange}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Play Video
        </button>
      </div>
      <div className="mb-6">
        <VideoPlayer
          videoId={videoId}
          onProgress={handleProgress}
          ref={playerRef}
        />
      </div>
      <div className="mt-4">
        <h2 className="font-semibold  text-lg">{videoDetails?.title}</h2>
        <div className="flex mt-4 pb-4 gap-2 border-b border-black">
          <h3 className="font-semibold  text-lg">Description </h3>
          <img
            onClick={() => setShowDescr(!showDescr)}
            className="w-6 h-4 mt-2 hover:cursor-pointer"
            src={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8AAADm5ubz8/MkJCQwMDD19fXw8PBXV1dQUFBZWVlTU1MuLi4pKSlYWFgmJiZeXl5mZmbExMRLS0vd3d2Dg4MfHx+tra2YmJjQ0NDh4eEODg6MjIxvb2/r6+toaGgYGBhDQ0M6OjoUjT9JAAAEKUlEQVR4nO3c6VbqMBQFYApaJgcUUVQcru//kBdvjCXNTihthhPu/n63y5yVM6QFHI2IiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIqHj3m9l6tX3IvYwTPWxX69nmvsOVL6vqn9ddHX1VAe1e1bJXR3fm4brSbiYplhbG2++qX5/9V74/Vo35NM3yBqs/Dlb9+O69dlMdmheSqHfGqje+S6efxrXVrIhE/TAX/elLvfuqZSk/UeuP9qJ9DfWpfbH8EOs7a81PnsvtCKul8ES1A/RG+GxfXs1EtxsrRfd886K+BTcIHhogRavqwrslW3CH3ESFAVZb/z1/0D1ChwYOcH2kqsbX6C6RIeIAr/xHmr3xJUxUebWIA7wcH79zjLpNtZTWUesVWuZthwD3IV6gexeyQsQ7eNEpQFeiiqpFvINdUlQRH+LQAF2JKuZ0gwPsmqIKbjdCahHXYLcm0xCcqMNTVHGM/vy7iAO8PjlAsYk6ZA62ja9giHkTFQd41StAkbUYqgY1cUOjXqAFnTYmTDjEVa4QQ8zBNlGJOoE72D9FFdxubnLsIk7Rvk2mIWZohBwTJjz6k9diuEFvw7WYeC5OZmgRQ2tQw7uYtBZrGGCYHfyGazFhouImE6IGNccBLlWIkxv054d30UOOWkwTYtwa1DK+nsI1OOwkg2Q7wIU/i7rgRI3+dYbpMkWKKlnazQQGGLbJNDIMDdxkQo4JU/IDHA4w3KC3JT7ApaxBDSdqpKf+yTxtiioJhwZO0RhjwpQsUadwB+OmqJJoLuYLMNEBDs/B+CmqJJiLqedgW/Q3cDlTVIn8sQ0eEzEHvS3qG7jcKapE/NgGn2RiHbbdotVi/hrUIn1sg2sw1ZgwRZmLuY5qWIRElZOiCm43A0LEAaZvMo3AiZr3qIbh0d8zRBxg2kFvC1iL0mpQw7vY48uaEo5qWKADnIyjGhako0o5qmEBalFqDWqDD3CSjmrYwLko66iGDfqGv/QUVXC76fRrG3lHNaz323B8kpExJkw9f22Dx4SEQW/rVYtl1KDW49c2eT586Q8PDc9Xi0oYEyZHR3Ulaild9NBJtVhWDWo4UWEtSnyi78IxF+2hIflxyQ8nqvVz6TJTVMHtZm7uIh4TsptMo0OilnNUw44+9ct+ou/iyNAouQY1nKg/tVjaUQ1zvNj4DrG8oxrmHBrnkKKK44z6UnyTaeBEhQVaXooquN2gqAsN0FWLlhJrUMPvblpkvpPpqkOilpuiCu6oB8rsooeO1GLJNajhofGj1DFh8oR4HgF6EvUcUlRxtJvym0wDDo3Sx4QJjP6yB73NqsXzqUGttYvntoPfjKFxLmPCNP76DfDrLAMcjab6f1K/yfsfhaE87xbrxe7If9wmIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiov/cX08aJw5PInkjAAAAAElFTkSuQmCC"
            }
          />
        </div>
        {showDescr && (
          <p className=" border-b border-black pb-4 font-normal text-sm mt-1">
            {videoDetails?.description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <AddNote
          currentTimestamp={currentTimestamp}
          onAddNote={handleAddNote}
          notes={notes}
        />
        {
          notes.length > 0 &&  
        <NotesList
          notes={notes}
          onDeleteNote={handleDeleteNote}
          onEditNote={handleEditNote}
          onJumpToTimestamp={handleJumpToTimestamp}
        />
        }
      </div>
    </div>
  );
};

export default App;
