import type { Request } from "express";

import express from "express";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { URL } from "url";

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 80;

app.use(helmet());
app.use(morgan("short"));
app.use("/", express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/",
  async (
    req: Request<unknown, unknown, { slug?: string; url: string }>,
    res
  ) => {
    let slug = req.body.slug || nanoid(16);
    let valid;
    let i = 0;

    do {
      valid = await prisma.url.findFirst({
        where: {
          slug: slug,
        },
      });
      if (valid === null) {
        break;
      }
      slug = nanoid(16 + i);
    } while (i++ <= 50);
    if (i === 50) {
      res.redirect("/error=Failed to create slug");
      return;
    }
    await prisma.url.create({
      data: {
        slug: slug,
        url: req.body.url,
      },
    });
    res.redirect("/");
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
