const styles = () => ({
  filterPopupRoot: { height: "50vh", padding: 25 },
  filterPopupTypo: { color: "#1976d2" },
  filterPopupPriceBox: { width: 500 },
  filterPopupPriceInput: { width: 50 },
  filterPopupPriceGrid: { textAlign: "center" },

  resultCardRoot: {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    margin: "10px",
    height: "40vh",
    width: "100%",
    marginBottom: 15,
  },
  resultCardColGrid: { height: "100%" },
  resultCardAvatar: { width: 120, height: 120, cursor: "pointer" },
  resultCardName: { fontWeight: "bold" },
  resultCardBio: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
    textAlign: "left",
  },
  resultCard3rdColGrid: {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    minHeight: "25vh",
    width: "100%",
    borderRadius: "5px",
  },
  resultCardHeader: {
    height: "20%",
  },
  resultCardHeaderGrid: { marginTop: 10 },
  resultCardServicesGrid: {
    textAlign: "center",
    width: "33.3%",
    color: "#1976d2",
  },
  resultCardServicesTypo: {
    fontWeight: "600",
  },
  resultCardServices: {
    height: "80%",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: "#1976d2 transparent",
    direction: "ltr",
    "&::-webkit-scrollbar": {
      direction: "ltr",
      borderRadius: 10,
      width: 7,
      backgroundColor: "lightgrey",
      backgroundWidth: 2,
      scrollbarGutter: "stable",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 10,
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 10,
      scrollPaddingLeft: 50,
      backgroundColor: "#1976d2",
      minHeight: 24,
      minWidth: 24,
    },
    "&::-webkit-scrollbar-thumb:focus": {
      backgroundColor: "#1976d2",
    },
    "&::-webkit-scrollbar-thumb:active": {
      backgroundColor: "#1976d2",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#1976d2",
    },
    "&::-webkit-scrollbar-corner": {
      backgroundColor: "transparent",
    },
  },
  resultCardServicesGridRes: { marginBottom: 15 },
  resultCardServicesResGrid: {
    textAlign: "center",
    width: "33.3%",
  },

  searchBoxRoot: { height: "100%" },
  searchBox0Autocomplete: { width: 300 },
  searchBox1Date: { width: 300 },

  sortPopupFormControl: { minWidth: 150 },
  sortPopupInputLabel: {
    marginLeft: 1,
    top: "-25%",
    transform: "translate(0,-50%",
  },
  sortPopupSelect: { height: 35 },
});

export default styles;
