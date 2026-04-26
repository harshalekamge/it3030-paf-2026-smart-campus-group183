import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqItems = [
  {
    question: 'How do I book a campus resource?',
    answer:
      'You can browse available resources and submit a booking request by selecting the date, time range, and purpose. Once submitted, your request will be reviewed and approved or rejected by an administrator.',
  },
  {
    question: 'Can I check the status of my bookings?',
    answer:
      'Yes, you can view all your booking requests in the system. Each request will show its current status, such as pending, approved, rejected, or cancelled.',
  },
  {
    question: 'How does the system prevent booking conflicts?',
    answer:
      'The system automatically checks for overlapping time slots and prevents multiple bookings for the same resource during the same period, ensuring accurate scheduling.',
  },
  {
    question: 'How do I report a maintenance issue?',
    answer:
      'You can create a maintenance ticket by selecting the relevant resource or location and providing a description of the issue. You may also attach images to help explain the problem.',
  },
  {
    question: 'Can I track the progress of my reported issues?',
    answer:
      'Yes, all tickets have a status workflow such as open, in progress, resolved, or closed. You can track updates and view comments from assigned staff or technicians.',
  },
  {
    question: 'Will I receive notifications for updates?',
    answer:
      'Yes, the system sends notifications for booking approvals, rejections, ticket updates, and new comments so you stay informed about all important activities.',
  },
  {
    question: 'Who can access and manage system features?',
    answer:
      'Access is controlled based on user roles. Regular users can make bookings and report issues, while administrators can manage resources, approve requests, and oversee system operations.',
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(
      isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel),
    );
  };

  return (
    <Container
      id="faq"
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
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        Frequently asked questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        {faqItems.map((item, index) => {
          const panelId = `panel${index + 1}`;

          return (
            <Accordion
              key={panelId}
              expanded={expanded.includes(panelId)}
              onChange={handleChange(panelId)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${panelId}-content`}
                id={`${panelId}-header`}
              >
                <Typography component="span" variant="subtitle2">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ maxWidth: { sm: '100%', md: '70%' } }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
  );
}
