import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { type CountType } from '../../types/count';

const Count = ({ item }: { item: CountType }) => {

  const { name, path, count, icon } = item;

  const navigate = useNavigate();

  return (<Card
    sx={{
      height: '100%',
      border: "1px solid #ddd",
      boxShadow: 2,
      borderRadius: 3,
      cursor: "pointer",
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: 6,
      },
    }}
    onClick={() => navigate(path)}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Grid>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h6"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {name}
          </Typography>
          <Typography
            color="textPrimary"
            variant="h3"
            mt={4}
            sx={{
              fontWeight: 'bold',
              fontSize: '2rem',
            }}
          >
            {count}
          </Typography>
        </Grid>
        <Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 54,
              width: 54,
              borderRadius: '50%',
              backgroundColor: 'background.paper',
              border: "1px solid",
              borderColor: "primary.main",
              boxShadow: 2,
              '&:hover': {
                boxShadow: 2
              },
            }}
          >
            {icon}
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
  )
};

export default Count;
