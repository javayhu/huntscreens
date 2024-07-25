"use client";
import Loading from "@/app/components/list.loading";
import { Suspense } from "react";
import ProductList from "../components/product.list";


export default async function IndiehackersPage() {
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
      </div>

      <Suspense fallback={<Loading />}>
        <ProductList cardType="indiehackers" genRequestUrl={(page) => `/api/indiehackers/time/${page}`}/>
      </Suspense>
    </div>
  </>
}