import { MetadataRoute } from "next";
import fs from "fs/promises";
import path from "path";
import { unstable_cacheLife } from "next/cache";
import { cache } from "react";

const getAuthors = cache(async () => {
  console.log("Current working directory:", process.cwd());
  console.log("Files in cwd:", await fs.readdir(path.join(process.cwd())));
  console.log(
    "Path to content/author:",
    path.join(process.cwd(), "content", "author")
  );

  const pathParts = ["content"];
  /**
   * Next.js 15.2.1 fails on the next line with the error:
   *
   * ```
   * Error: ENOENT: no such file or directory, scandir '/var/task/content/author'
   *     at async (.next/server/app/sitemap.xml/route.js:16:2327)
   *     at async (.next/server/app/sitemap.xml/route.js:16:1342) {
   * errno: -2,
   * code: 'ENOENT',
   * syscall: 'scandir',
   *  path: '/var/task/content/author'
   * }
   * ```
   */
  const files = await fs.readdir(path.join(process.cwd(), ...pathParts));
  const fileReads = files.map(async (fileName) => {
    const readFile = await fs.readFile(
      path.join(process.cwd(), ...pathParts, fileName),
      "utf-8"
    );
    const meta = JSON.parse(readFile) as {
      name: string;
      slug: string;
      position: string;
    };
    return {
      fileNameSlug: path.parse(fileName).name,
      meta,
    };
  });
  return await Promise.all(fileReads);
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const authors = await getAuthors();
  return authors.map((author) => ({
    url: `https://example.com/authors/${author.meta.slug}`,
  }));
}
