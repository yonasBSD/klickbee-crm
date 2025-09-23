"use client"

import * as React from "react"
import { cn } from "@/libs/utils"

type KeyGetter<T> = (item: T) => string
type AmountGetter<T> = (item: T) => number

export type GridViewProps<T extends Record<string, any>> = {
  // Items to render in the grid
  items: T[]
  // Function to group items into columns (e.g., item => item.stage)
  groupBy?: KeyGetter<T>
  // String key to group by (e.g., "stage"). If both groupBy and groupKey are omitted, falls back to "stage" if it exists on the item.
  groupKey?: string
  // Optional explicit order of columns (keys). If omitted, columns are alphabetical by key.
  order?: string[]
  // Optional mapping of column keys to display labels
  labels?: Record<string, string>
  // How to render each card
  renderCard: (item: T) => React.ReactNode
  // Optional getter to compute totals per column (e.g., item => item.amount)
  getAmount?: AmountGetter<T>
  // Provide a unique id accessor. Defaults to "id" if present or index fallback.
  getId?: (item: T, index: number) => string | number
  // Optional header right-side actions per column (e.g., a + button)
  renderColumnAction?: (groupKey: string, items: T[]) => React.ReactNode
  // Optional per-column header classNames to slightly vary appearance if desired
  columnHeaderClassName?: (groupKey: string) => string | undefined
  // Optional empty state per-column
  renderEmpty?: (groupKey: string) => React.ReactNode
  className?: string
}

/**
 * GridView
 * - Groups items by groupBy(item) into columns.
 * - Derives headings from grouped keys.
 * - Shows counts and optional total using getAmount.
 * - Renders each item via renderCard.
 * - Mobile-first: columns are horizontally scrollable.
 */
export function GridView<T extends Record<string, any>>(props: GridViewProps<T>) {
  const {
    items,
    groupBy,
    groupKey,
    order,
    labels,
    renderCard,
    getAmount,
    getId,
    renderColumnAction,
    columnHeaderClassName,
    renderEmpty,
    className,
  } = props

  // Unified getter to obtain grouping key via groupBy, groupKey, or fallback to "stage"
  const getGroupKey = React.useCallback(
    (item: T) => {
      if (groupBy) return groupBy(item)
      if (groupKey && item && Object.prototype.hasOwnProperty.call(item, groupKey)) {
        const v = item[groupKey as keyof T]
        return v == null ? "Ungrouped" : String(v as any)
      }
      if ("stage" in item) return String((item as any).stage)
      return "Ungrouped"
    },
    [groupBy, groupKey],
  )

  // Group items by key
  const groups = React.useMemo(() => {
    const map = new Map<string, T[]>()
    for (const item of items) {
      const key = getGroupKey(item)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return map
  }, [items, getGroupKey])

  // Determine column keys (ordered)
  const keys = React.useMemo(() => {
    const existingKeys = Array.from(groups.keys())
    if (order && order.length) {
      // Include only keys present in data; then append any extras not in order
      const ordered = order.filter((k) => groups.has(k))
      const extras = existingKeys.filter((k) => !order.includes(k)).sort()
      return [...ordered, ...extras]
    }
    return existingKeys.sort()
  }, [groups, order])

  // Column totals
  const totals = React.useMemo(() => {
    if (!getAmount) return {}
    const agg: Record<string, number> = {}
    for (const key of keys) {
      const arr = groups.get(key) ?? []
      agg[key] = arr.reduce((sum, item) => sum + (getAmount(item) || 0), 0)
    }
    return agg
  }, [keys, groups, getAmount])

  const formatCurrency = React.useCallback((value: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value)
    } catch {
      return `${value}`
    }
  }, [])

  const getItemId = React.useCallback(
    (item: T, index: number) => {
      if (getId) return getId(item, index)
      if ("id" in item) return String(item.id)
      return index
    },
    [getId],
  )

  return (
    <div
      className={cn(
        "w-full overflow-x-auto",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-start gap-4",
        )}
        role="list"
        aria-label="Grid columns"
      >
        {keys.map((key) => {
          const label = labels?.[key] ?? key
          const arr = groups.get(key) ?? []
          const total = (getAmount && totals[key]) || 0

          return (
            <section
              key={key}
              className={cn(
                "min-w-[23.5%] w-[23.5%] flex-shrink-0",
              )}
              aria-label={`${label} column`}
              role="listitem"
            >
              <header
                className={cn(
                  "flex items-center justify-between py-2",
                  columnHeaderClassName?.(key),
                )}
              >
                <div className="flex items-center gap-2">
                  {/* subtle status dot; uses theme tokens to avoid hard-coded colors */}
                  <span className="h-2 w-2 rounded-full bg-primary/70" aria-hidden="true" />
                  <h3 className="text-sm font-medium text-pretty">
                    {label} <span className="opacity-70">({arr.length})</span>
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {getAmount ? (
                    <span className="text-xs font-medium text-foreground/80">{formatCurrency(total)}</span>
                  ) : null}
                  {renderColumnAction?.(key, arr)}
                </div>
              </header>

              <ul className="mt-3 space-y-3" aria-label={`${label} items`}>
                {arr.length === 0 && renderEmpty ? (
                  <li className="text-sm text-muted-foreground">{renderEmpty(key)}</li>
                ) : null}
                {arr.map((item, index) => (
                  <li key={getItemId(item, index)} className="list-none">
                    {renderCard(item)}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default GridView
