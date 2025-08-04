import { Button } from "@radix-ui/themes";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Hello</h1>
      <Button>
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </div>
  );
}
