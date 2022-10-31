import { Typography, Card, Grid, CardContent, CardHeader } from "@mui/material";

export default function BookingSummary({
  freelancerDate,
  freelancerServices,
  checked,
  appTime,
  price,
}) {
  return (
    <Card>
      <CardHeader subheader={freelancerDate} />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={4} sx={{ fontWeight: "bold" }}>
            Chosen Services
          </Grid>
          <Grid item xs={4} sx={{ fontWeight: "bold" }}>
            Cost
          </Grid>
          <Grid item xs={4} sx={{ fontWeight: "bold" }}>
            Estimated Time
          </Grid>
          <Grid item xs={12}>
            {Object.entries(freelancerServices).map(
              ([category, fServices], _) => {
                return (
                  <div>
                    {fServices.map((fs, i) => {
                      if (checked[category].has(i)) {
                        return (
                          <Grid container spacing={4}>
                            <Grid item xs={4}>
                              {fs.name}
                            </Grid>
                            <Grid item xs={4}>
                              {fs.price} Eur
                            </Grid>
                            <Grid item xs={4}>
                              {fs.estimatedTime} min
                            </Grid>
                          </Grid>
                        );
                      }
                    })}
                  </div>
                );
              }
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-evenly">
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {" "}
                  Total Cost:
                </Typography>
                {price} Eur
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {" "}
                  Total estimated time:
                </Typography>
                {appTime} min
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
