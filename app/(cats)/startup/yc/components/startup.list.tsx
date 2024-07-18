"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SWRConfig } from "swr";
import ProductBlock from "../../../components/product.block";
import { YCSearchParams } from "@/types/yc.types";


export default function StartupList({ sort, status }: YCSearchParams) {
  const [page, setPage] = useState(1);
  const infPages = [];
  for (let i = 0; i < page; i++) {
    infPages.push(<ProductBlock key={i} cardType="yc" endpoint_url={`/api/startups/yc/${status}/${sort}/${i + 1}`} />);
  }
  return <>
    <SWRConfig>
      {infPages}
      <div className="flex flex-row justify-center items-center p-10">
        <Button onClick={() => setPage(page + 1)}>Load More...</Button>
      </div>
    </SWRConfig>
  </>
}