import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Stack,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EditIcon from "@mui/icons-material/Edit";

function TaskFormDialog({ open, onClose, onSave, editing }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setDescription(editing.description || "");
      setStatus(editing.status || "Pending");
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
    }
    setErrors({});
  }, [editing, open]);

  const validate = () => {
    const e = {};

    if (!title || !title.trim()) {
      e.title = "Title is required";
    } else if (title.trim().length < 3 || title.trim().length > 12) {
      e.title = "Title must be between 3 and 12 characters";
    }

    if (!description || !description.trim()) {
      e.description = "Description is required";
    } else if (
      description.trim().length < 10 ||
      description.trim().length > 250
    ) {
      e.description = "Description must be between 10 and 250 characters";
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    await onSave({
      title: title.trim(),
      description: description.trim(),
      status,
    });
    setSaving(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 5,
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: editing ? "secondary.main" : "success.main",
              color: "white",
              width: 42,
              height: 42,
            }}
          >
            {editing ? <EditIcon /> : <AddTaskIcon />}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {editing ? "Edit Task" : "Create New Task"}
          </Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 1, backgroundColor: "background.default" }}>
        <Stack spacing={3}>
          <TextField
            label="Title *"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            variant="outlined"
          />

          <TextField
            label="Description *"
            fullWidth
            multiline
            minRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            variant="outlined"
          />

          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={saving}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          variant="contained"
          color={editing ? "secondary" : "success"}
          sx={{ textTransform: "none", minWidth: 100 }}
        >
          {saving ? (
            <CircularProgress size={18} color="inherit" />
          ) : editing ? (
            "Update Task"
          ) : (
            "Create Task"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskFormDialog;
