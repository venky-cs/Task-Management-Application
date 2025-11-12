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
} from "@mui/material";

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
      description.trim().length > 150
    ) {
      e.description = "Description must be between 10 and 150 characters";
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
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
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving} variant="contained">
          {saving ? (
            <CircularProgress size={18} />
          ) : editing ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default TaskFormDialog;
