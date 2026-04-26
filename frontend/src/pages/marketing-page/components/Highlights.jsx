import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import highlightsBackground from '../../../assets/highlights-background.png';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Adaptable workflows',
    description:
      'Our system easily adapts to different campus needs, improving efficiency while simplifying booking and maintenance processes.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Built for reliability',
    description:
      'Designed to handle daily campus operations with stability and consistency, ensuring smooth performance across all system modules.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'User-friendly experience',
    description:
      'Navigate the platform effortlessly with a clean interface that supports quick actions and clear system interactions.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Smart functionality',
    description:
      'Access powerful features for managing resources, bookings, and maintenance tasks in one integrated environment.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Real-time notifications',
    description:
      'Stay updated with instant alerts for booking approvals, ticket updates, and important system activities.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'Attention to detail',
    description:
      'Carefully designed workflows ensure accuracy, consistency, and better control over campus operations.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
        backgroundImage: `linear-gradient(rgba(8, 14, 26, 0.76), rgba(8, 14, 26, 0.84)), url(${highlightsBackground})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Explore what makes our Smart Campus system effective: efficient
            workflows, reliable operations, user-friendly design, and seamless
            integration. Experience structured management and accuracy across all
            campus activities.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'rgba(17, 25, 39, 0.72)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
