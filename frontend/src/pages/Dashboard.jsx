import { useEffect, useState, useContext } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import TaskFormDialog from "../components/TaskFormDialog";
import TaskViewDialog from "../components/TaskViewDialog";

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

  // Modal state
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // toast
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  // Fetch tasks
  const fetchTasks = async (p = page, l = limit) => {
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
  };

  useEffect(() => {
    fetchTasks(); // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      setToast({ open: true, type: "success", message: "Task deleted" });
    } catch (err) {
      console.error("delete task", err);
      setToast({
        open: true,
        type: "error",
        message: err?.response?.data?.error || "Delete failed",
      });
    }
  };

  function truncateWords(text = "", maxWords = 50) {
    const words = (text || "").trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + " ...";
  }

  const CARD_WIDTH_PX = 360;
  const CARD_HEIGHT_PX = 220;
  const TITLE_LINE_CLAMP = 2;
  const DESC_LINE_CLAMP = 3;

  // Pagination
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Dashboard</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {mdUp ? (
            // Desktop table
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "22%", minWidth: 180 }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ width: "46%", minWidth: 300 }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ width: "12%", minWidth: 100 }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ width: "12%", minWidth: 140 }}>
                        Created
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ width: "8%", minWidth: 100 }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tasks.map((t) => (
                      <TableRow key={t._id} sx={{ height: 96 }}>
                        {/* Title  */}
                        <TableCell
                          sx={{
                            verticalAlign: "top",
                            px: 2,
                          }}
                        >
                          <Box
                            component="div"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 1.2,
                              maxHeight: "2.4em",
                            }}
                            title={t.title}
                            aria-label={truncateWords(t.title, 12)}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 500, fontSize: "0.98rem" }}
                            >
                              {t.title}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Description*/}
                        <TableCell
                          sx={{
                            verticalAlign: "top",
                            px: 2,
                          }}
                        >
                          <Box
                            component="div"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 1.15,
                              maxHeight: "3.45em",
                            }}
                            title={t.description}
                            aria-label={truncateWords(t.description, 40)}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: "0.95rem" }}
                            >
                              {t.description}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Status */}
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color:
                                t.status === "Completed"
                                  ? (theme) => theme.palette.success.main
                                  : (theme) => theme.palette.error.main,
                            }}
                          >
                            {t.status}
                          </Typography>
                        </TableCell>

                        {/* Created */}
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(t.createdAt)}
                          </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right" sx={{ verticalAlign: "top" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: 0.5,
                              height: "100%",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleOpenView(t)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(t)}
                            >
                              <EditIcon />
                            </IconButton>
                            {user?.role === "admin" && (
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(t._id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
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
            // Mobile cards
            <>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="flex-start"
              >
                {tasks.map((t) => (
                  <Grid
                    item
                    key={t._id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "stretch", // make all grid cells same height
                    }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        width: `${CARD_WIDTH_PX}px`, // fixed width for all cards
                        height: `${CARD_HEIGHT_PX}px`, // fixed height for all cards
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        flex: "0 0 auto", // prevent grow/shrink
                      }}
                    >
                      {/* Content area */}
                      <CardContent
                        sx={{ flex: "1 1 auto", overflow: "hidden", pb: 0 }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box sx={{ flex: 1, pr: 1, minWidth: 0 }}>
                            {/* Title - consistent clamp */}
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                display: "-webkit-box",
                                WebkitLineClamp: TITLE_LINE_CLAMP,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.2,
                                maxHeight: `${1.2 * TITLE_LINE_CLAMP}em`,
                              }}
                              title={t.title}
                            >
                              {t.title}
                            </Typography>

                            {/* Description - consistent clamp */}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.6,
                                display: "-webkit-box",
                                WebkitLineClamp: DESC_LINE_CLAMP,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "normal",
                                lineHeight: 1.15,
                              }}
                              title={t.description}
                            >
                              {t.description || ""}
                            </Typography>
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              ml: 1,
                              whiteSpace: "nowrap",
                              color:
                                t.status === "Completed"
                                  ? (theme) => theme.palette.success.main
                                  : (theme) => theme.palette.error.main,
                            }}
                          >
                            {t.status}
                          </Typography>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          Created: {formatDate(t.createdAt)}
                        </Typography>
                      </CardContent>

                      {/* Action row - fixed height, aligned to bottom */}
                      <CardActions
                        sx={{
                          justifyContent: "flex-end",
                          gap: 1,
                          pt: 1,
                          pb: 1,
                        }}
                      >
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
                            onClick={() => handleDelete(t._id)}
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

                {/* pagination centered */}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mt: 1 }}
              >
                <Button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Prev
                </Button>
                <Box sx={{ px: 2, display: "flex", alignItems: "center" }}>
                  {page + 1}
                </Box>
                <Button
                  disabled={(page + 1) * limit >= total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </Grid>
            </>
          )}
        </>
      )}

      {/* Add/Edit Dialog and View Dialog */}
      <TaskFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        editing={editing}
      />

      <TaskViewDialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        task={viewing}
        formatDate={formatDate}
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
