"use client"
import { Card, CardContent } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { cn } from "@/libs/utils"
import type { Deal } from "../types"
import { Badge } from "@/components/ui/Table"

type DealCardProps = {
  deal: Deal
  className?: string
}

// Map stage -> subtle token-based badge styles (no hard-coded colors)
const stageBadgeClass: Record<string, string> = {
  new: "bg-accent text-accent-foreground",
  contacted: "bg-muted text-muted-foreground",
  proposal: "bg-secondary text-secondary-foreground",
  won: "bg-primary/10 text-primary",
  lost: "bg-destructive/10 text-destructive",
}

const currency = (v: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v)

export function DealCard({ deal, className }: DealCardProps) {
  console.log(deal.stage, 'deal stage', stageBadgeClass[deal.stage]);
  const badgeClass = stageBadgeClass[deal.stage] ?? "bg-muted text-muted-foreground"

  return (
    <Card className={cn("border", className)} role="article" aria-label={deal.dealName}>
      <CardContent className="p-4 gap-3">
        {/* Stage badge */}
        <div className="mb-2">
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", badgeClass)}>
            <Badge variant={deal.stage}>{labelForStage(deal.stage)}</Badge>
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-pretty">{deal.dealName}</h4>

        {/* Amount + contact */}
        <p className="mt-1 text-sm">
          {currency(deal.amount)} <span className="opacity-60">• {deal.contact}</span>
        </p>

        {/* Date / tags / activity */}
        <div className=" text-xs">
          {deal.date ? (
            <div className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red/30" > icon</span>
              <span>{deal.date}</span>
            </div>
          ) : null}
          {deal.activity ? (
            <div className="flex items-start gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
              <span>{deal.activity}</span>
            </div>
          ) : null}
          {deal.tags ? (
            <div className="flex items-start gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
              <span className="truncate">{deal.tags}</span>
            </div>
          ) : null}
        </div>

        {/* Owner */}
        <div className="mt-4 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={deal.ownerImage || "/placeholder.svg"} alt={deal.owner} />
            <AvatarFallback>{initials(deal.owner)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-foreground/80">{deal.owner}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function labelForStage(stage: Deal["stage"]) {
  switch (stage) {
    case "new":
      return "New"
    case "contacted":
      return "Contacted"
    case "proposal":
      return "Proposal Sent"
    case "won":
      return "Won"
    case "lost":
      return "Lost"
    default:
      return stage
  }
}

function initials(name?: string) {
  if (!name) return "?"
  const parts = String(name).trim().split(/\s+/)
  const [a, b] = [parts[0]?.[0], parts[1]?.[0]]
  return (a || "") + (b || "")
}

export default DealCard
