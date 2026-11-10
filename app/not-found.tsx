import { Button, PageHeader } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="Page not found" title="This page does not exist." intro="The address may be mistyped, or the page may have moved." />
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-36">
        <Button href="/">Back to the home page</Button>
      </div>
    </>
  );
}
