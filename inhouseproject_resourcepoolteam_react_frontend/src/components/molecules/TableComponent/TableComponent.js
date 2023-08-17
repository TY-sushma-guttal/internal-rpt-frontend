import { useState, useEffect } from "react";
import {
  TableBody,
  TableCell,
  Table,
  Box,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
  IconButton,
  Autocomplete,
  TextField,
  TableSortLabel,
  Paper,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

import Checkbox from "@mui/material/Checkbox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Fragment } from "react";
import { visuallyHidden } from "@mui/utils";
import CheckBoxComponent from "../../atoms/CheckBoxComponent/CheckBoxComponent";
import ButtonComponent from "../../atoms/ButtonComponent/ButtonComponent";
import CheckBoxComponentTwo from "../../atoms/CheckBoxComponentTwo/CheckBoxComponentTwo";
import SearchIcon from "@mui/icons-material/Search";

const theme = createTheme({
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#70B3D129 !important" },
        },
      },
    },
  },
});
const theme2 = createTheme({
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "" },
        },
      },
    },
  },
});

const CustomTextField = styled(TextField)`
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #bdd7fb; // Change this color to your desired color
    border-width: 3px;
  }
`;

const useStyles = makeStyles({
  tableHeader: {
    fontWeight: "600 !important",
    fontSize: "14px !important",
    // borderBottom: "1px solid #70B3D1 !important",
  },
  tableRow: {
    border: "none !important",
    color: "#373737",
    fontWeight: "500",
    fontSize: "13px",
  },
});

export default function TableComponent({
  tableRows = [],
  tableColumns = [],
  headerTitle = "",
  showAddBtn = false,
  addbtnlabel = "",
  showHeader = false,
  showSearchInput = false,
  showfliterDrop = false,
  onRowClick = () => {},
  showCheckbox = false,
  enableRowDetails = false,
  lastColWidth = "20px",
  onHeaderBtnClick = () => {},
  onSelectionChange = () => {},
  containerClass = "tableborder",
  insideTab = false,
  customHeight = false,
  tableHeight = "calc(100vh - 255px)",
  showPagination = true,
  showPaginationFooter = true,
  footerButtonOutlinedLabel = "Finalized",
  footerButtonFilledLabel = "Paid",
  showFooterButtonOutlined = true,
  showFooterButtonFilled = true,
  showFooterCancelButton = false,
  disableFooterButtonFilled = false,
  filledBtnClick = () => {},
  outlinedBtnClick = () => {},
  showSelection = false,
  customMessage = null,
  tableSize = "",
  submitButtonLabel = "",
  handleSubmit = () => {},
  showSubmit = false,
  disableSubmitButton = false,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [clickedRow, setClickedRow] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hoverRow, setHoverRow] = useState();
  const [searchText, setSearchText] = useState("");
  const [filterName, setFilterName] = useState([]);
  const [showFooter, setShowFooter] = useState(false);
  const [filterOption, setFilterOption] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  // let listValue = filterdata;
  // let listFilter = listValue.slice(0, listValue.length - 1);
  // search
  useEffect(() => {
    setSelected([]);
  }, [rows]);

  useEffect(() => {
    if (showfliterDrop && tableColumns.length) {
      let arr = tableColumns.filter((val) => {
        return val.filter === true;
      });
      setFilterOption(arr);
    }
  }, []);

  useEffect(() => {
    if (searchText) {
      const filteredData = tableRows?.filter((item) => {
        const data = [];
        let row = {};
        if (filterName.length) {
          filterName.map((val) => {
            row = { ...row, [item[val.id]]: item[val.id] };
          });
        } else {
          row = { ...item };
        }
        Object.values(row).map((ele) => {
          if (typeof ele === "string") data.push(ele);
        });
        return data.join("").toLowerCase().includes(searchText.toLowerCase());
      });
      if (filteredData) {
        setPage(0);
        setRows([...filteredData]);
      } else {
        setRows([]);
      }
    } else {
      setRows([...tableRows]);
    }
  }, [searchText]);

  useEffect(() => {
    if (tableRows.length || tableColumns.length) {
      setRows([...tableRows]);
      setColumns([...tableColumns]);
    }
  }, [tableRows, tableColumns]);

  useEffect(() => {
    setPage(0);
  }, [tableColumns]);

  const handleChangePage = (event, newPage) => {
    console.log(newPage, "this is new page");
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (selected.length) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
    onSelectionChange(selected);
  }, [selected]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const renderTagsComponent = (ele = []) => {
    const value = [];
    ele.map((item) => {
      value.push(item.label);
    });
    return (
      <Typography className="w-75 text-truncate">{value.join(", ")}</Typography>
    );
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const onCancelSelection = () => {
    setSelected([]);
  };

  return (
    <Box
      sx={{ width: "100%", overflow: "hidden" }}
      className={`${containerClass}`}
    >
      {showHeader && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingX={1.9}
            paddingY={2.2}
            sx={{ background: "#F8F9FB" }}
          >
            <Box className="w-100">
              {headerTitle && (
                <Typography
                  variant="h6"
                  //   className="tableHeadercolor fs-20 fw-500"
                  fontSize={20}
                  fontWeight="500"
                >
                  {headerTitle}
                </Typography>
              )}
            </Box>

            {customMessage ? customMessage : null}

            <Box display="flex" justifyContent="flex-end" className="w-100">
              {(showSearchInput || showfliterDrop) && (
                <Box display="flexs">
                  {showSearchInput && (
                    <Box marginRight={2}>
                      <CustomTextField
                        size="small"
                        placeholder="Search here..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{
                          width: { md: "280px", sm: "150px" },
                          backgroundColor: "#FFFFFF",
                          borderRadius: "30px",
                          "& .MuiOutlinedInput-root:hover": {
                            "& > fieldset": {
                              borderColor: "#CCCCCC",
                              // borderWidth: "3px",
                              borderRadius: "30px",
                            },
                          },
                          "& .MuiOutlinedInput-root:focus": {
                            "& > fieldset": {
                              borderColor: "#D1E1E8",
                              borderWidth: "5px",
                            },
                          },
                          "& .MuiOutlinedInput-root": {
                            "& > fieldset": {
                              borderRadius: "30px",
                            },
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "red", // Change this color to your desired color
                          },
                        }}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon sx={{ color: "#FF9800" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  )}
                  {showfliterDrop && (
                    <Box sx={{ width: { md: "250px", sm: "150px" } }}>
                      <Autocomplete
                        sx={{
                          "& .MuiAutocomplete-endAdornment": {
                            borderLeft: "1px solid #A6A6A6",
                          },
                        }}
                        multiple
                        size="small"
                        limitTags={1}
                        options={filterOption}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={!filterName.length ? "Filter" : ""}
                          />
                        )}
                        value={filterName}
                        onChange={(_, val) => setFilterName(val)}
                        renderOption={(props, filterName, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              checkedIcon={<CheckBoxIcon />}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {filterName.label}
                          </li>
                        )}
                        renderTags={(ele) => renderTagsComponent(ele)}
                        disableCloseOnSelect
                      />
                    </Box>
                  )}
                </Box>
              )}
              <Box marginLeft={3}>
                {showAddBtn && (
                  <ButtonComponent
                    onBtnClick={onHeaderBtnClick}
                    label={addbtnlabel}
                    sx={{ width: "150px" }}
                    muiProps="add-btn-color-orange"
                    borderRadius="30px"
                  />
                )}
              </Box>
            </Box>
          </Box>
          {/* <Divider className="tableDividercolor" /> */}
        </>
      )}
      <Paper>
        <TableContainer
          sx={{
            height: !customHeight
              ? showHeader && showFooter
                ? "calc(100vh - 340px)"
                : showHeader
                ? "calc(100vh - 280px)"
                : showFooter || insideTab
                ? "calc(100vh - 300px)"
                : tableHeight
              : tableHeight,

            border: "none",
          }}
        >
          <Table size={tableSize} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {showCheckbox && (
                  <TableCell
                    sx={{ paddingLeft: 3 }}
                    classes={{ root: classes.tableHeader }}
                    padding="checkbox"
                  >
                    <CheckBoxComponentTwo
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      onChange={handleSelectAllClick}
                      checked={
                        rows.length > 0 && selected.length === rows.length
                      }
                    />
                  </TableCell>
                )}
                {columns?.length > 0 &&
                  columns?.map((item, index) => {
                    return (
                      <Fragment key={item.id}>
                        <TableCell
                          key={item.id}
                          classes={{ root: classes.tableHeader }}
                          sx={{
                            display: item.hideColumn && "none",
                            // color: headerTextColor,
                            minWidth: item.minWidth || "auto",
                            py: 2.5,
                            background: "#D1E1E8",
                          }}
                          align={item.align || "left"}
                        >
                          {item?.sort !== false ? (
                            <TableSortLabel
                              active
                              direction={orderBy === item.id ? order : "asc"}
                              onClick={createSortHandler(item.id)}
                            >
                              {item.label}
                              {orderBy === item.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc"
                                    ? "sorted descending"
                                    : "sorted ascending"}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          ) : (
                            <>{item.label}</>
                          )}
                        </TableCell>
                      </Fragment>
                    );
                  })}
                {enableRowDetails ? (
                  <TableCell
                    classes={{ root: classes.tableHeader }}
                    key={columns.length + 2}
                    sx={{ minWidth: lastColWidth }}
                  ></TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    sx={{
                      textAlign: "center",
                      height: "240px",
                      fontSize: 20,
                      fontWeight: "600",
                    }}
                  >
                    No Records Available
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <Fragment key={index}>
                        <ThemeProvider theme={theme}>
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            classes={{ root: classes.tableRow }}
                            onMouseEnter={() => {
                              setHoverRow(index);
                            }}
                            sx={{
                              background:
                                showSelection && clickedRow === index
                                  ? "#e2f6ffad"
                                  : "unset",
                            }}
                            onMouseLeave={() => setHoverRow()}
                            onMouseOver={() => setHoverRow(index)}
                          >
                            {showCheckbox && (
                              <TableCell
                                padding="checkbox"
                                //   className="ps-3"
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(224, 224, 224, 1)",
                                  paddingLeft: 3,
                                }}
                              >
                                <CheckBoxComponentTwo
                                  checked={isItemSelected}
                                  onChange={(event) =>
                                    handleClick(event, row.id)
                                  }
                                />
                              </TableCell>
                            )}
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  // sx={{
                                  //   visibility: column?.showOnHover
                                  //     ? hoverRow === index
                                  //       ? "visible"
                                  //       : "hidden"
                                  //     : "visible",
                                  // }}
                                  onClick={
                                    column.disableRowClick !== true
                                      ? () => {
                                          setClickedRow(row.id);
                                          onRowClick(row.id);
                                        }
                                      : () => {}
                                  }
                                >
                                  {/* show any item on hover only */}
                                  {column?.showOnHover
                                    ? hoverRow === index
                                      ? column.format &&
                                        typeof value === "number"
                                        ? column.format(value)
                                        : value
                                      : null
                                    : column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                            {enableRowDetails ? (
                              <TableCell
                                onClick={() => {
                                  setClickedRow(row.id);
                                  onRowClick(row.id);
                                }}
                                key={columns.length + 2}
                                sx={{ minWidth: lastColWidth }}
                                align={"center"}
                              >
                                <IconButton>
                                  <NavigateNextIcon
                                    sx={{
                                      color:
                                        hoverRow === index ? "#1181B2" : "",
                                    }}
                                  />
                                </IconButton>
                              </TableCell>
                            ) : null}
                          </TableRow>
                        </ThemeProvider>
                      </Fragment>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {showPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={
              {
                // "& .MuiTablePagination-selectLabel": { marginBottom: "0" },
                // "& .MuiTablePagination-displayedRows": { marginBottom: "0" },
              }
            }
          />
        )}
        {showFooter && showPaginationFooter && (
          <Box sx={{ borderTop: "1px solid #70B3D1" }}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              paddingTop={2}
            >
              {showFooterCancelButton && (
                <ButtonComponent
                  variant="outlined"
                  label="Cancel"
                  muiProps="py-2 px-3 mx-1"
                  onBtnClick={onCancelSelection}
                />
              )}
              {showFooterButtonOutlined && (
                <ButtonComponent
                  variant="outlined"
                  label={footerButtonOutlinedLabel}
                  muiProps="py-2 px-3 mx-1"
                  onBtnClick={outlinedBtnClick}
                />
              )}
              {showFooterButtonFilled && (
                <ButtonComponent
                  label={footerButtonFilledLabel}
                  muiProps="py-2 px-3 mx-1"
                  onBtnClick={filledBtnClick}
                  disabled={disableFooterButtonFilled}
                />
              )}
            </Box>
          </Box>
        )}
        <Box></Box>
        {showSubmit && (
          <Box
            display="flex"
            justifyContent="flex-end"
            marginRight={2}
            marginTop={1}
          >
            <ButtonComponent
              label={submitButtonLabel}
              onBtnClick={handleSubmit}
              disabled={disableSubmitButton}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
