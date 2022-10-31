import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { sortSearchedFreelancersFunc } from "../../utils/functions";
import styles from "./styles";
import useClasses from "../../hooks/useClasses";

const SortPopup = ({
  currFreelancers,
  setFilteredFreelancers,
  setSortSubmit,
  sort,
  setSort,
}) => {
  const classes = useClasses(styles);

  const [open, setOpen] = React.useState(false);

  const handleChange = async (event) => {
    setSort(event.target.value);
    setSortSubmit(true);
    setFilteredFreelancers(
      sortSearchedFreelancersFunc(event.target.value, currFreelancers)
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.sortPopupFormControl}>
        {!open && (
          <InputLabel
            className={sort === "" ? classes.sortPopupInputLabel : undefined}
          >
            Sort By
          </InputLabel>
        )}
        {/* sort options dropdown list */}
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={sort}
          label={!open ? "Sort By" : ""}
          className={classes.sortPopupSelect}
          onChange={handleChange}
        >
          <MenuItem value={"averageRating"}>Highest Rating</MenuItem>
          <MenuItem value={"price"}>Minimum Service Price</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SortPopup;
