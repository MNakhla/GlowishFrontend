import { createTheme, ThemeProvider } from "@mui/material/styles";
const styledTheme = createTheme({
  components: {
    // Name of the component
    MuiCalendarPicker: {
      styleOverrides: {
        // Name of the slot
        root: {},
      },
    },
  },
});
export { styledTheme };
