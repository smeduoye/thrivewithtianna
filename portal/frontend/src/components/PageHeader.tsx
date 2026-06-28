import { Typography } from '@mui/material';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <>
      <Typography
        variant="overline"
        sx={{ color: 'secondary.main', letterSpacing: '0.15em', display: 'block', mb: 1 }}
      >
        {eyebrow}
      </Typography>
      <Typography variant="h3" component="h1" gutterBottom>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mb: 3 }}>
          {subtitle}
        </Typography>
      ) : null}
    </>
  );
}
