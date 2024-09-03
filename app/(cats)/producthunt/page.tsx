import { Suspense } from "react";
import ProductList from "../components/product.list";
import PHTopics from "./components/ph.topic";
import SortDropdown from "./components/ph.sort";
import Loading from "@/app/components/ui/skeleton/list.loading";

export default function PHPage({ searchParams }: {
  searchParams: {
    sort?: "time" | "vote",
    topic?: string
  },
}) {
  const sort = searchParams.sort || "time";
  const topic = searchParams.topic || "All";
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className='w-full px-5 flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between items-center'>
        <PHTopics selectedTag={topic} />
        <SortDropdown selectedValue={sort} />
      </div>

      <Suspense fallback={<Loading />}>
        <ProductList
          cardType="ph"
          baseUrl={`/api/products/${topic}/${sort}/{page}`}
        />
      </Suspense>
    </div>
  </>
}