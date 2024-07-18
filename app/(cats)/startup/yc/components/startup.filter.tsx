"use client";
import { Button } from "@/components/ui/button";
import { CoinsIcon, Skull, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const displayCategories: { [key: string]: string } = {
  "All": "All",
  "Public": "Public",
  "Acquired": "Acquired",
}

export default function YCFilter(props: {
  selectedTag: string
}) {
  const [selected, setSelected] = useState(props.selectedTag);

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return <div className="flex flex-row pb-5 md:pb-0 gap-1 w-full overflow-auto">
    {Object.keys(displayCategories).map(key => (
      <div key={key}>
        <Link href={pathname + `?` + createQueryString("status", displayCategories[key])}>
          <Button onClick={() => setSelected(key)} className="" variant={selected === key ? "secondary" : "ghost"} size={"sm"}>
            {key === "Died" && <Skull color="red" size={15} className="mr-1" />}
            {key === "Public" && <TrendingUp color="green" size={15} className="mr-1" />}
            {key === "Acquired" && <CoinsIcon color="black" size={15} className="mr-1" />}
            {key}
          </Button>
        </Link>
      </div>
    ))}
  </div>
}