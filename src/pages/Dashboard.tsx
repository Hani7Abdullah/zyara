//MUI
import { Stack, Grid } from '@mui/material';
import { DashboardOutlined as Categories, Inventory2Outlined as ProductsIcon, Storefront as StoresIcon } from '@mui/icons-material';

//Types
import { type CountModel, type CountType } from '../types/count';

//Components
import Count from '../components/dashboard/Count';

//Translation
import { useTranslation } from 'react-i18next';
import Charts from '../components/dashboard/Charts';
import { useCountStore } from '../store/useCountStore';
import { useEffect } from 'react';

export default function Dashboard() {

  const { t } = useTranslation();

  const fetchCounts = useCountStore((s) => s.fetchCounts);
  const counts = useCountStore((s) => s.data as CountModel);

  useEffect(()=>{
    fetchCounts()
  },[])

  const countsData: CountType[] = [
     {
      name: t("stores"),
      path: "/stores",
      count: counts.stores,
      icon: <StoresIcon fontSize="large" sx={{ color: "primary.main" }} />
    },
    {
      name: t("categories"),
      path: "/categories",
      count: counts.categories,
      icon: <Categories fontSize="large" sx={{ color: "primary.main" }} />
    },
    {
      name: t("products"),
      path: "/products",
      count: counts.products,
      icon: <ProductsIcon fontSize="large" sx={{ color: "primary.main" }} />
    },
  ]
  return (
    <Stack direction="column" rowGap={3}>
      <Grid container spacing={3}>
        {countsData.map((count, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Count item={count} />
          </Grid>
        ))}
      </Grid>
      <Charts />
    </Stack>);
}