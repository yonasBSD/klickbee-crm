"use client"

import React from "react"
import { getPipelineData } from "../libs/PipelineData"

const CHART_HEIGHT = 236

export function PipelineCard() {
  const { title, stages, conversionRates } = getPipelineData()
  




  return (
    <section className="rounded-xl  h-[488px] border border-[var(--border-gray)] bg-white">
      <div className="flex h-[58px] items-center justify-between p-[16px] border-b border-[var(--border-gray)]">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        <button className="text-xs font-medium text-[var(--foreground)]">See Details</button>
      </div>

<div className="p-4">
  <div className="relative">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="absolute top-0 bottom-0 border-l border-dashed border-[var(--border-gray)]"
        style={{ left: `${(i / 5) * 100}%` }}
      />
    ))}

    <div className="grid grid-cols-5 text-sm">
      {stages.map((s) => (
        <div key={s.stage} className="pb-3 [130px]">
          <div className="px-3">
            <div className="text-xs text-[var(--foreground)]">{s.stage}</div>
            <div className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {s.count.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>

    
    <div className="grid grid-cols-5 text-sm mt-15 ">
      <div className="bg-purple-500 h-55 [clip-path:polygon(0_0,100%_11%,100%_100%,0%_100%)]" />
      <div className="bg-purple-400 h-55 [clip-path:polygon(0_11%,100%_30%,100%_100%,0%_100%)]" />
      <div className="bg-purple-300 h-55 [clip-path:polygon(0_30%,100%_52%,100%_100%,0%_100%)]" />
      <div className="bg-purple-200 h-55 [clip-path:polygon(0_52%,100%_52%,100%_100%,0%_100%)]" />
      <div className="bg-purple-100 h-55 [clip-path:polygon(0_52%,100%_69%,100%_100%,0%_100%)]" />
    </div>
  </div>

  {/* Conversion rates */}
  <div className="mt-2 grid grid-cols-5 items-center text-xs">
    <div className="px-3 whitespace-nowrap  py-2 font-medium text-[var(--foreground)]">
      Conversion Rate
    </div>
    {conversionRates.map((rate, i) => (
      <div
        key={i}
        className={`px-3 py-2 text-center ${
          i === conversionRates.length - 1
            ? "text-[#8B5CF6] font-semibold"
            : "text-muted-foreground"
        }`}
      >
        {rate.toFixed(2)}%
      </div>
    ))}
  </div>
</div>


    </section>
  )
}

export default PipelineCard


