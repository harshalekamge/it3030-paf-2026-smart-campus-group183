import Box from '@mui/material/Box';

export default function SitemarkIcon() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mr: 2,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 14,
          height: 14,
          borderRadius: '4px',
          background: 'linear-gradient(135deg, #5b6cff 0%, #7c4dff 100%)',
          transform: 'rotate(45deg)',
          boxShadow: '0 3px 10px rgba(91, 108, 255, 0.28)',
          flexShrink: 0,
        }}
      />
      <Box
        component="span"
        sx={{
          color: 'primary.main',
          fontSize: '1.55rem',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        UniFlow
      </Box>
    </Box>
  );
}
