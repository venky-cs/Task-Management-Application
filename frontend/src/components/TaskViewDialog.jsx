import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function TaskViewDialog({ open, onClose, task, formatDate }) {
  if (!task) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>View Task</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6">{task.title}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 1 }}
          >
            Created: {formatDate(task.createdAt)}
          </Typography>
          <Typography variant="body1">{task.description}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{
              mt: 2,
              color:
                task.status === "Completed"
                  ? (theme) => theme.palette.success.main
                  : (theme) => theme.palette.error.main,
            }}
          >
            Status: {task.status}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskViewDialog;
