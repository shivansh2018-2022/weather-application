import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs");
  });

app.post("/get-secret",async(req,res) => {
    const lat = req.body.latitude;
    const long = req.body.longitude;
    try {
        const result = await axios.get("https://api.open-meteo.com/v1/forecast?latitude="+ lat + "&longitude=" + long + "&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,windspeed_10m_max&timezone=Asia%2FBangkok&forecast_days=1");
        const time = JSON.stringify(result.data.daily.time[0]);
        const max_temp = JSON.stringify(result.data.daily.temperature_2m_max[0]);
        const min_temp = JSON.stringify(result.data.daily.temperature_2m_min[0]);
        const uv = JSON.stringify(result.data.daily.uv_index_max[0]);
        const precipitation = JSON.stringify(result.data.daily.precipitation_sum[0]);
        const windspeed = JSON.stringify(result.data.daily.windspeed_10m_max[0]);
        
        res.render("index.ejs", { time, max_temp, min_temp, uv, precipitation, windspeed});
      } catch (error) {
        res.render("index.ejs", { content: JSON.stringify(error.response.data) });
      }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });