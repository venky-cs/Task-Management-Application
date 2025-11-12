import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  Chip,
  Divider,
  DialogContentText,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

function TaskViewDialog({ open, onClose, task, formatDate }) {
  if (!task) return null;

  const statusColor = task.status === "Completed" ? "success" : "error";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
            <AssignmentIcon />
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              noWrap={false}
              sx={{ fontWeight: 700, lineHeight: 1.15 }}
            >
              {task.title}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Created: {formatDate(task.createdAt)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={task.status}
              color={statusColor}
              size="small"
              sx={{ textTransform: "uppercase", fontWeight: 700 }}
            />
          </Stack>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent
        dividers
        sx={{
          pt: 2,
          maxHeight: "50vh",
        }}
      >
        <DialogContentText
          component="div"
          sx={{ whiteSpace: "pre-wrap", color: "text.primary" }}
        >
          {task.description || (
            <Typography color="text.secondary">
              No description provided.
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskViewDialog;
