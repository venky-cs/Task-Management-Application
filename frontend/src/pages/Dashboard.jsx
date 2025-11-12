import { useEffect, useState, useContext, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TablePagination,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import TaskFormDialog from "../components/TaskFormDialog";
import TaskViewDialog from "../components/TaskViewDialog";
import ConfirmDialog from "../components/ConfirmDialog";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modals
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // Confirm Delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  // Fetch tasks
  const fetchTasks = useCallback(async (p, l) => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", {
        params: { page: p + 1, limit: l },
      });
      const { tasks: items, total: tot } = res.data;
      setTasks(items || []);
      setTotal(tot || 0);
    } catch (err) {
      console.error("fetch tasks", err);
      setToast({
        open: true,
        type: "error",
        message: err?.response?.data?.error || "Failed to load tasks",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(page, limit);
  }, [page, limit, fetchTasks]);

  const handleOpenCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const handleOpenEdit = (task) => {
    setEditing(task);
    setOpenForm(true);
  };
  const handleOpenView = (task) => {
    setViewing(task);
  };

  const handleSave = async (payload) => {
    try {
      if (editing) {
        const res = await api.put(`/tasks/${editing._id}`, payload);
        setTasks((prev) =>
          prev.map((t) => (t._id === res.data._id ? res.data : t))
        );
        setToast({ open: true, type: "success", message: "Task updated" });
      } else {
        await api.post("/tasks", payload);
        setToast({ open: true, type: "success", message: "Task created" });
        fetchTasks(0, limit);
        setPage(0);
      }
    } catch (err) {
      console.error("save task", err);
      setToast({
        open: true,
        type: "error",
        message: err?.response?.data?.error || "Save failed",
      });
    } finally {
      setOpenForm(false);
    }
  };

  const handleDeleteClick = (task) => {
    setDeleteTarget(task);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${deleteTarget._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      setTotal((t) => Math.max(0, t - 1));
      setToast({ open: true, type: "success", message: "Task deleted" });
    } catch (err) {
      console.error("delete task", err);
      setToast({
        open: true,
        type: "error",
        message: err?.response?.data?.error || "Delete failed",
      });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);
  };

  function truncateWords(text = "", maxWords = 50) {
    const words = (text || "").trim().split(/\s+/);
    return words.length <= maxWords
      ? text
      : words.slice(0, maxWords).join(" ") + " ...";
  }

  const CARD_WIDTH_PX = 360;
  const CARD_HEIGHT_PX = 220;

  return (
    <Container sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Task Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Task
        </Button>
      </Box>

      {/* Table / Cards */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : mdUp ? (
        // Desktop Table
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "background.default" }}>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tasks.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {t.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {truncateWords(t.description, 30)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            t.status === "Completed"
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                      >
                        {t.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(t.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                        px: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "nowrap",
                        }}
                      >
                        <Tooltip title="View Task">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenView(t)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Task">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(t)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {user?.role === "admin" && (
                          <Tooltip title="Delete Task">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(t)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      ) : (
        // Mobile Cards
        <Grid container spacing={3} justifyContent="center">
          {tasks.map((t) => (
            <Grid item key={t._id}>
              <Card
                elevation={3}
                sx={{
                  width: CARD_WIDTH_PX,
                  height: CARD_HEIGHT_PX,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {t.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      color:
                        t.status === "Completed"
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      display: "block",
                    }}
                  >
                    Status: {t.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(t.createdAt)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pb: 1 }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenView(t)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(t)}
                  >
                    Edit
                  </Button>
                  {user?.role === "admin" && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(t)}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
          {tasks.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center">No tasks found</Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <TaskFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        editing={editing}
      />

      {/* View Dialog */}
      <TaskViewDialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        task={viewing}
        formatDate={formatDate}
      />

      {/* Delete Modal */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Task?"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>"{deleteTarget?.title || "this task"}"</strong>?
            <br />
            <Typography
              variant="body2"
              color="error"
              sx={{ fontWeight: 600, mt: 1, display: "inline-block" }}
            >
              This action cannot be undone.
            </Typography>
          </>
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
