import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { Message } from '../api/messages';
import { brand } from '../theme';

interface MessageThreadProps {
  messages: Message[];
  viewerRole: 'client' | 'coach';
  onSend: (body: string) => void;
  sending: boolean;
  isLoading: boolean;
  emptyHint: string;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function MessageThread({
  messages,
  viewerRole,
  onSend,
  sending,
  isLoading,
  emptyHint,
}: MessageThreadProps) {
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || sending) {
      return;
    }
    onSend(trimmed);
    setDraft('');
  };

  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          maxHeight: 460,
          minHeight: 240,
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        {isLoading ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={20} />
            <Typography>Loading messages…</Typography>
          </Stack>
        ) : null}

        {!isLoading && messages.length === 0 ? (
          <Typography color="text.secondary">{emptyHint}</Typography>
        ) : null}

        <Stack spacing={1.5}>
          {messages.map((message) => {
            const mine = message.authorRole === viewerRole;
            return (
              <Box
                key={message.id}
                sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}
              >
                <Box sx={{ maxWidth: '78%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      px: 1.75,
                      py: 1.1,
                      borderRadius: 2,
                      bgcolor: mine ? brand.sage : '#fff',
                      color: mine ? '#fff' : 'text.primary',
                      border: mine ? 'none' : '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.body}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.25, textAlign: mine ? 'right' : 'left' }}
                  >
                    {message.authorRole === 'coach' ? 'Coach' : 'You'} · {formatTime(message.createdAt)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Stack>
      </Paper>

      <Stack direction="row" spacing={1} alignItems="flex-end">
        <TextField
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a message…"
          multiline
          maxRows={4}
          fullWidth
          size="small"
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={sending || draft.trim().length === 0}
          aria-label="Send message"
        >
          {sending ? <CircularProgress size={20} /> : <SendIcon />}
        </IconButton>
      </Stack>
    </Stack>
  );
}
