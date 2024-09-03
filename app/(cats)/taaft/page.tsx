"use client";
import { Suspense } from "react";
import { YCSortBy } from "../../../types/yc.types";
import ProductList from "../components/product.list";
import Loading from "@/app/components/ui/skeleton/list.loading";

export default function TaaftPage({ searchParams }: {
  searchParams: {
    sort?: YCSortBy
  }
}) {
  const sort = searchParams.sort || "time";
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
      </div>

      <Suspense fallback={<Loading />}>
        <ProductList cardType="taaft" baseUrl={`/api/taafts/{page}`} />
      </Suspense>
    </div>
  </>
}