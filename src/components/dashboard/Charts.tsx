import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Box, Paper, Typography, MenuItem,
  Select, FormControl, InputLabel, useTheme,
  type SelectChangeEvent
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useStatisticStore } from '../../store/useStatisticStore';
import { useTranslation } from 'react-i18next';

export default function OrdersChart() {
  const { data: statistics, fetchStatistics, loading } = useStatisticStore();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    fetchStatistics(year);
  }, [year]);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedYear = Number(event.target.value);
    setYear(selectedYear);
  };

  const years = Array.from({ length: new Date().getFullYear() - 2025 + 1 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {t('chart.monthly-orders')} – {year}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="year-select-label">{t('chart.year')}</InputLabel>
          <Select
            labelId="year-select-label"
            value={year.toString()}
            label={t('chart.year')}
            onChange={handleChange}
          >
            {years.map((yr) => (
              <MenuItem key={yr} value={yr.toString()}>{yr}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={Array.isArray(statistics) ? statistics : []}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="orders"
            name={t('orders')}
            stroke={theme.palette.primary.main}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>


      {loading && (
        <Typography variant="body2" align="center" mt={2}>
          {t('loading')}...
        </Typography>
      )}
    </Paper>
  );
}
