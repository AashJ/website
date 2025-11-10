import { MDXContent } from "@content-collections/mdx/react";

const MDXArticle = ({
  code,
  title,
  date,
}: {
  code: string;
  title: string;
  date: string;
}) => {
  return (
    <div className="p-4 space-y-4 mx-auto max-w-6xl overflow-y-auto">
      <div className="space-y-2">
        <h1 className="text-foreground font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{date}</p>
      </div>
      <article className="prose dark:prose-invert max-w-6xl mx-auto">
        <MDXContent code={code} />
      </article>
    </div>
  );
};

export default MDXArticle;
