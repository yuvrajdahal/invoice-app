import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Page() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Link href={"/dashboard"} className="text-white font-semibold flex items-center gap-2 ">
        Dashboard <ArrowRight />
      </Link>
    </div>
  );
}
export default Page;
