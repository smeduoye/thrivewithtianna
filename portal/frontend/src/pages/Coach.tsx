import { Alert, Card, CardContent, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiErrorMessage } from '../api/client';
import { fetchMyThread, sendMyMessage } from '../api/messages';
import { MessageThread } from '../components/MessageThread';
import { PageHeader } from '../components/PageHeader';

export function Coach() {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, isError, error } = useQuery({
    queryKey: ['messages', 'me'],
    queryFn: fetchMyThread,
  });

  const send = useMutation({
    mutationFn: sendMyMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread'] });
    },
  });

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Coach"
        title="Messages"
        subtitle="Ask questions, share wins, or get guidance. Tianna reads and replies here."
      />

      <Card>
        <CardContent>
          {isError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiErrorMessage(error, 'Could not load your messages.')}
            </Alert>
          ) : null}
          {send.isError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiErrorMessage(send.error, 'Could not send your message.')}
            </Alert>
          ) : null}

          <MessageThread
            messages={messages ?? []}
            viewerRole="client"
            onSend={(body) => send.mutate(body)}
            sending={send.isPending}
            isLoading={isLoading}
            emptyHint="No messages yet. Say hello to your coach to get started."
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
