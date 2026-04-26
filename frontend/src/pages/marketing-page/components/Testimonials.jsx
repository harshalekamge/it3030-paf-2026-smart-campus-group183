import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const userTestimonials = [
  {
    avatar: <Avatar>A</Avatar>,
    name: 'A. Perera',
    occupation: 'Undergraduate Student',
    testimonial:
      "I absolutely love how easy it is to book campus resources! Whether I'm reserving a lab or a meeting room, the system adapts perfectly to my needs. The clean interface has truly improved my daily tasks, making everything faster and more convenient.",
  },
  {
    avatar: <Avatar>K</Avatar>,
    name: 'K. Silva',
    occupation: 'Academic Staff',
    testimonial:
      "One of the standout features of this system is the booking workflow. In my experience, requests are processed quickly and efficiently by the admin team. It's reassuring to know that approvals and updates are handled in a structured and reliable manner.",
  },
  {
    avatar: <Avatar>N</Avatar>,
    name: 'N. Fernando',
    occupation: 'System Administrator',
    testimonial:
      'The level of simplicity and user-friendliness in this system has significantly improved how we manage campus operations. I appreciate how it brings everything together, from bookings to maintenance, in a way that is both clear and efficient.',
  },
  {
    avatar: <Avatar>S</Avatar>,
    name: 'S. Jayasinghe',
    occupation: 'Facilities Coordinator',
    testimonial:
      'I appreciate the attention to detail in the design of this platform. Small features like notifications and status updates make a big difference. It’s clear that the system was built with real campus workflows in mind.',
  },
  {
    avatar: <Avatar>R</Avatar>,
    name: 'R. Wijeratne',
    occupation: 'IT Support Officer',
    testimonial:
      "I've used other systems before, but this one stands out because of its structured approach. Managing resources, tracking bookings, and handling requests all feel seamless. It clearly addresses the everyday needs of both students and staff.",
  },
  {
    avatar: <Avatar>D</Avatar>,
    name: 'D. Gunawardena',
    occupation: 'Operations Manager',
    testimonial:
      'The quality of this system exceeded my expectations. It is well-organized, responsive, and easy to navigate. From reporting issues to tracking progress, everything works smoothly. Definitely a valuable solution for modern campus management.',
  },
];

export default function Testimonials() {
  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '72%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Testimonials
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          See how students and staff benefit from our Smart Campus system.
          Discover how we improve booking efficiency, resource management, and
          maintenance workflows. Designed for usability, reliability, and seamless
          campus operations.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: 'flex' }}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: 'text.secondary' }}
                >
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
              <Box>
                <CardHeader
                  avatar={testimonial.avatar}
                  title={testimonial.name}
                  subheader={testimonial.occupation}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
