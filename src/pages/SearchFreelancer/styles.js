const styles = () => ({
  searchBoxGrid: {
    borderRadius: "10px",
    height: "60vh",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
  },
  daySwitch: {
    display: "none",
  },
  freelancerResCards: {
    marginBottom: 10,
    borderRadius: "10px",
    height: "82vh",
    width: "91vw",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: "#1976d2 transparent",

    "&::-webkit-scrollbar": {
      borderRadius: 10,
      width: 7,
      backgroundColor: "lightgrey",
      backgroundWidth: 2,
      scrollbarGutter: "stable",
      scrollPaddingLeft: 50,
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 10,
      scrollPaddingLeft: 50,
      backgroundColor: "#1976d2",
      minHeight: 24,
      minWidth: 24,
    },
  },
  infiniteScroll: { overflow: "hidden", width: "90vw" },
});

export default styles;
