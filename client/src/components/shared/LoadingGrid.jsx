import { Grid, Card, CardContent, Skeleton } from "@mui/material";

export default function LoadingGrid({ count = 8 }) {
  return Array.from(new Array(count)).map((_, index) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
      <Card>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    </Grid>
  ));
}
