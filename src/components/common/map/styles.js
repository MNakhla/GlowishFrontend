const styles = () => ({
  avatar: { width: 80, height: 80 },
  popupNameGrid: { height: "2vh", marginBottom: 10 },
  popupNameTypo: { fontWeight: "bold" },
  popupBioTypo: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  popupDaysGrid: { paddingTop: 5 },
  popupButtonGrid: { height: "7vh", paddingTop: 10 },
  popupServicesGrid: {
    border: "5px solid #1976d2",
    borderRadius: "10px",
    width: "8vw",
    padding: 10,
  },
});
export default styles;
