import express, {Request,Response,Application, NextFunction} from "express";
import { applicationsRouter } from "../routes/applications.route";
import { usersRouter } from "../routes/users.route";
import { adminRouter } from "../routes/admin.route";
import { jobsRouter } from "../routes/jobs.route";
import swaggerDocs from "../utils/swagger";
import bodyParser from "body-parser";



const app = express();
const PORT =  8080 || process.env.PORT ;
app.use(bodyParser.json());


app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/jobs", jobsRouter);
app.use("/applications", applicationsRouter);


app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  swaggerDocs(app, PORT)
});