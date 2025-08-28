'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

// Custom MUI theme for Iron Man HUD aesthetic
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'linear-gradient(to bottom, #1a202c, #2d3748)',
    },
    primary: {
      main: '#42A5F5',
      light: '#90CAF9',
    },
    text: {
      primary: '#E3F2FD',
      secondary: '#B0BEC5',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 0 20px rgba(66, 153, 225, 0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          animation: 'glow 1.5s ease-in-out infinite alternate',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#42A5F5' },
            '&:hover fieldset': { borderColor: '#90CAF9' },
            '&.Mui-focused fieldset': { borderColor: '#42A5F5', boxShadow: '0 0 8px rgba(66, 153, 225, 0.8)' },
          },
        },
      },
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      textShadow: '0 0 12px rgba(66, 153, 225, 0.8)',
      fontSize: '2.8rem',
    },
    h6: {
      fontWeight: 500,
      color: '#90CAF9',
    },
  },
});

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fridayGreetings = [
    'Hey boss, systems are hot and ready. What’s the play?',
    'F.R.I.D.A.Y. online. Let’s make some sparks fly.',
    'All systems green. What’s on your mind, genius?'
  ];

  const getRandomFridayGreeting = () => {
    return fridayGreetings[Math.floor(Math.random() * fridayGreetings.length)];
  };

  const fetchGrokResponse = async (input) => {
    try {
      const response = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return `Grok: ${data.response}`;
    } catch (error) {
      throw new Error(`Grok error: ${error.message}`);
    }
  };

  const fetchFridayResponse = async (input) => {
    try {
      const response = await fetch('/api/friday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return `F.R.I.D.A.Y.: ${data.response}`;
    } catch (error) {
      throw new Error(`Friday error: ${error.message}`);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const grokResponse = await fetchGrokResponse(query);
      const fridayResponse = await fetchFridayResponse(query);
      const combinedResponse = `${grokResponse}\n\n${fridayResponse}`;
      setResponse(combinedResponse);
      setHistory([{ query, response: combinedResponse, timestamp: new Date() }, ...history]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h1" sx={{ mb: 4, textAlign: 'center' }}>
          Grok x F.R.I.D.A.Y. Dashboard
        </Typography>
        <Card sx={{ maxWidth: 800, width: '100%', p: { xs: 2, sm: 3 } }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              {getRandomFridayGreeting()}
            </Typography>
            <Box component="form" onSubmit={handleQuerySubmit} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask Grok or F.R.I.D.A.Y. something..."
                variant="outlined"
                sx={{ mb: 2 }}
                autoFocus
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ width: '100%', py: 1.5, fontSize: '1.1rem' }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Query'}
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {response && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 1,
                  border: '1px solid rgba(66, 153, 225, 0.5)',
                  mb: 3,
                }}
              >
                <Typography sx={{ whiteSpace: 'pre-line', fontSize: '1rem' }}>
                  {response}
                </Typography>
              </Box>
            )}
            {history.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Conversation History
                </Typography>
                {history.slice(0, 5).map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 1,
                      border: '1px solid rgba(66, 153, 225, 0.3)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 0 15px rgba(66, 153, 225, 0.7)',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Query: {item.query}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Response: {item.response}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
        <Typography variant="caption" sx={{ mt: 3, color: 'text.secondary', textAlign: 'center' }}>
          Powered by xAI’s Grok and OpenAI’s ChatGPT. Configure APIs at{' '}
          <Link href="https://x.ai/api" color="primary" underline="hover">
            x.ai/api
          </Link>{' '}
          and{' '}
          <Link href="https://platform.openai.com/docs/api-reference" color="primary" underline="hover">
            OpenAI
          </Link>.
        </Typography>
      </Box>
      <style jsx global>{`
        @keyframes glow {
          from {
            box-shadow: 0 0 10px rgba(66, 153, 225, 0.5);
          }
          to {
            box-shadow: 0 0 20px rgba(66, 153, 225, 1);
          }
        }
      `}</style>
    </ThemeProvider>
  );
}