import express from "express";
import type { Request } from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 80;

app.use(helmet());
app.use(morgan("short"));
app.use("/", express.static(path.join(__dirname, "../public")));

app.post(
  "/",
  async (
    req: Request<unknown, unknown, { slug?: string; url: string }>,
    res
  ) => {
    /*
        Generate new entry
    */
  }
);

app.get("/:slug", async (req: Request<{ slug: string }>, res) => {
  const slug = req.params.slug;
  const url = await prisma.url.findFirst({
    where: {
      slug: slug,
    },
  });
  res.redirect(url ? url.url : "/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
