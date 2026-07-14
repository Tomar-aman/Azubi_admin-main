"use client";

import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import TablePaginationDemo from "@/app/components/pagination";
import { ReactElement } from "react";
import CustomLoader from "./SpinLoader";
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    fontWeight: "600",
    color: "#000",
    fontSize: 16,
    border: "0px",
    borderBottom: "1px solid #646464",
    padding: "22px 22px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    borderBottom: "1px solid #646464",
    padding: "22px 22px",
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fff",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
    background: "transparent",
  },
}));
interface Props {
  loading?: boolean;
  columns: {
    name: string;
    key: string;
    width?: number | string;
  }[];
  pageCount: number;
  recordPerPage: string;
  setRecordPerPage: (payload: string) => void;
  setPageNo: (payload: number) => void;
  pageNo: number;
  rows: Record<string, string | number | ReactElement | boolean | undefined>[];
  /** Enable a leading checkbox column for multi-row selection. */
  selectable?: boolean;
  /** Currently selected row ids (uses each row's `id`). */
  selectedIds?: string[];
  /**
   * Called when the selection changes. Accepts either the next list of ids or
   * a functional updater (so it can be wired straight to a `setState` setter);
   * the updater form keeps rapid successive clicks from clobbering each other.
   */
  onSelectionChange?: (
    value: string[] | ((prev: string[]) => string[]),
  ) => void;
}
const CustomTable = (props: Props) => {
  const selectedIds = props.selectedIds || [];

  // Ids of the rows currently rendered (only rows that expose an `id`).
  const pageIds = props.rows
    .map((row) => row.id)
    .filter((id): id is string | number => id !== undefined && id !== null)
    .map((id) => String(id));

  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelected =
    pageIds.some((id) => selectedIds.includes(id)) && !allSelected;

  const handleSelectAll = () => {
    if (!props.onSelectionChange) return;
    props.onSelectionChange((prev) => {
      const allSel =
        pageIds.length > 0 && pageIds.every((id) => prev.includes(id));
      return allSel
        ? prev.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...prev, ...pageIds]));
    });
  };

  const handleSelectRow = (id: string) => {
    if (!props.onSelectionChange) return;
    props.onSelectionChange((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id],
    );
  };

  const colSpan = props.columns.length + (props.selectable ? 1 : 0);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0px 10px 15px -3px rgba(15, 23, 42, 0.08)",
          borderRadius: "10px",
          height: "calc(100vh - 222px)",
        }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              {props.selectable && (
                <StyledTableCell
                  padding="checkbox"
                  onClick={handleSelectAll}
                  sx={{ cursor: "pointer", width: 56 }}
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    readOnly
                    tabIndex={-1}
                    sx={{
                      pointerEvents: "none",
                      color: "#0096A4",
                      "&.Mui-checked": { color: "#0096A4" },
                      "&.MuiCheckbox-indeterminate": { color: "#0096A4" },
                    }}
                  />
                </StyledTableCell>
              )}
              {props.columns.map((data) => (
                <StyledTableCell width={data.width} key={data.key}>
                  {data.name}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ position: "relative" }}>
            {!props.loading &&
              props.rows.map((row, index) => {
                const rowId =
                  row.id !== undefined && row.id !== null
                    ? String(row.id)
                    : undefined;
                const isSelected =
                  rowId !== undefined && selectedIds.includes(rowId);
                return (
                  <StyledTableRow
                    key={index}
                    sx={
                      isSelected
                        ? { backgroundColor: "rgba(0,150,164,0.08) !important" }
                        : undefined
                    }
                  >
                    {props.selectable && (
                      <StyledTableCell
                        padding="checkbox"
                        onClick={() => rowId !== undefined && handleSelectRow(rowId)}
                        sx={{ cursor: rowId !== undefined ? "pointer" : "default", width: 56 }}
                      >
                        {rowId !== undefined && (
                          <Checkbox
                            checked={isSelected}
                            readOnly
                            tabIndex={-1}
                            sx={{
                              pointerEvents: "none",
                              color: "#0096A4",
                              "&.Mui-checked": { color: "#0096A4" },
                            }}
                          />
                        )}
                      </StyledTableCell>
                    )}
                    {props.columns.map((column) => {
                      return (
                        <StyledTableCell key={column.key}>
                          {row[column.key]}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}

            {props.loading && (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={colSpan}
                  style={{
                    height: "calc(100vh - 293px)",
                    background: "#fff",
                  }}
                >
                  <CustomLoader />
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationDemo
        pageCount={props.pageCount}
        setRecordPerPage={props.setRecordPerPage}
        recordPerPage={props.recordPerPage}
        setPageNo={props.setPageNo}
        pageNo={props.pageNo}
      />
    </>
  );
};
export default CustomTable;
