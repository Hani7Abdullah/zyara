import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export default function ViewTable({
  rows,
}: {
  rows: { label: string; value?: string | ReactNode }[]; 
}) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Table>
        <TableBody
          sx={{
            "& td": {
              p: 1.1
            }
          }}
        >
          {rows.map((row, index) => (
            <TableRow key={index}>
              {/* Label */}
              <TableCell
                sx={{
                  width: 200,
                  textTransform: "capitalize",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  bgcolor: "grey.50",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  {row.label}
                </Typography>
              </TableCell>

              {/* Value */}
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    color: row.value ? "text.primary" : "text.disabled",
                    fontStyle: row.value ? "normal" : "italic",
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap", // allows wrapping
                  }}
                >
                  {row.value || "-"}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
