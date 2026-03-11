import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Fab, 
  Grid, 
  Card, 
  CardContent, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Add as AddIcon, 
  History as HistoryIcon, 
  Logout as LogoutIcon, 
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Undo as UndoIcon
} from '@mui/icons-material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [players, setPlayers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openScore, setOpenScore] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [selectedLoserId, setSelectedLoserId] = useState('');
  const [selectedBall, setSelectedBall] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [playersRes, historyRes] = await Promise.all([
        api.get('/players'),
        api.get('/scores/history')
      ]);
      setPlayers(playersRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) return;
    try {
      await api.post('/players', { name: newPlayerName });
      setNewPlayerName('');
      setOpenAdd(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlayer = async (id) => {
    if (window.confirm('Xóa người chơi này?')) {
      try {
        await api.delete(`/players/${id}`);
        fetchData();
      } catch (err) {
        alert('Không thể xóa người chơi đã có lịch sử ghi điểm!');
      }
    }
  };

  const handleRecordScore = async () => {
    if (!selectedWinner || !selectedLoserId || !selectedBall) return;
    try {
      await api.post('/scores', {
        winnerId: selectedWinner.id,
        loserId: selectedLoserId,
        ballNumber: selectedBall
      });
      setOpenScore(false);
      setSelectedLoserId('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async (id) => {
    if (window.confirm('Hoàn tác bản ghi này?')) {
      try {
        await api.delete(`/scores/undo/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getPoints = (ball) => {
    if (ball === 3) return 1;
    if (ball === 6) return 2;
    if (ball === 9) return 3;
    return 0;
  };

  const ballColors = {
    3: '#cc0000', // Đỏ
    6: '#33cc33', // Xanh lá
    9: '#fb8c00'  // Cam
  };

  return (
    <Box sx={{ pb: 10 }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #333' }}>
        <Toolbar>
          <Typography variant="h5" color="primary" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            9-BALL SCORE
          </Typography>
          <IconButton onClick={() => setOpenHistory(true)} color="inherit">
            <HistoryIcon />
          </IconButton>
          <IconButton onClick={handleLogout} sx={{ ml: 1 }} color="error">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        {loading && players.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : players.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5 }}>
            <Typography variant="h6">Chưa có người chơi</Typography>
            <Typography variant="body2">Bấm dấu + để thêm</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {players.map((player) => (
              <Grid item xs={6} key={player.id}>
                <Card 
                  onClick={() => {
                    setSelectedWinner(player);
                    setOpenScore(true);
                  }}
                  sx={{ 
                    borderRadius: 3, 
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    '&:active': { transform: 'scale(0.95)' },
                    border: '1px solid #333',
                    position: 'relative'
                  }}
                >
                  <IconButton 
                    size="small" 
                    sx={{ position: 'absolute', top: 5, right: 5, opacity: 0.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlayer(player.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" noWrap sx={{ px: 2 }}>
                      {player.name}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mt: 1, 
                        fontWeight: 'bold',
                        color: player.score > 0 ? 'success.main' : player.score < 0 ? 'error.main' : 'inherit'
                      }}
                    >
                      {player.score > 0 ? `+${player.score}` : player.score}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Floating Add Button */}
      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={() => setOpenAdd(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialog Thêm Người Chơi */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="xs">
        <DialogTitle>Thêm Người Chơi</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Tên người chơi"
            variant="outlined"
            margin="dense"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Hủy</Button>
          <Button onClick={handleAddPlayer} variant="contained">Tạo</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ghi Điểm (Scoring) */}
      <Dialog open={openScore} onClose={() => setOpenScore(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: 'center' }}>Ghi Điểm Cho {selectedWinner?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Chọn bi bắn vào:</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              {[3, 6, 9].map((num) => (
                <Box 
                  key={num}
                  onClick={() => setSelectedBall(num)}
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: ballColors[num],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: selectedBall === num ? `0 0 15px ${ballColors[num]}` : 'none',
                    border: selectedBall === num ? '3px solid white' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {num}
                </Box>
              ))}
            </Stack>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              (+{getPoints(selectedBall)} điểm)
            </Typography>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Người bị bắn (trừ điểm)</InputLabel>
            <Select
              value={selectedLoserId}
              label="Người bị bắn (trừ điểm)"
              onChange={(e) => setSelectedLoserId(e.target.value)}
            >
              {players
                .filter(p => p.id !== selectedWinner?.id)
                .map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenScore(false)} fullWidth>Hủy</Button>
          <Button 
            onClick={handleRecordScore} 
            variant="contained" 
            fullWidth 
            disabled={!selectedLoserId}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drawer Lịch Sử */}
      <Drawer
        anchor="right"
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        PaperProps={{ sx: { width: '85%', maxWidth: 400 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Lịch Sử</Typography>
          <IconButton onClick={() => fetchData()}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {history.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', opacity: 0.5 }}>
              <Typography variant="body2">Chưa có lịch sử</Typography>
            </Box>
          ) : (
            history.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem 
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleUndo(item.id)}>
                      <UndoIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        <b>{item.winnerName}</b> ăn bi <b>{item.ballNumber}</b> từ <b>{item.loserName}</b>
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="success.main">+{item.points}đ</Typography>
                        <Typography variant="caption" color="error.main">-{item.points}đ</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.5 }}>• {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Drawer>
    </Box>
  );
};

export default MainPage;
