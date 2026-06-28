import { Card, CardContent, Typography } from '@mui/material';
import { PageHeader } from '../components/PageHeader';

interface PlaceholderProps {
  title: string;
  phase: string;
}

export function Placeholder({ title, phase }: PlaceholderProps) {
  return (
    <>
      <PageHeader eyebrow="Coming soon" title={title} subtitle={phase} />
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            This screen is scaffolded for mobile navigation. Implementation follows the MVP
            milestone plan in <code>docs/MVP_APPLICATION_SPEC.md</code>.
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
