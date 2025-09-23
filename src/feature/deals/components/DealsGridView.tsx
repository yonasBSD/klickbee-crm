import GridView from "@/components/ui/GridView"
import { DealCard } from "./DealCard"
import type { Deal } from "../types"

const dealsData = [
  {
    id: "1",
    dealName: "Maison Dupont - Construction",
    company: "SARL Dumas",
    contact: "Marc Dupont",
    stage: "new",
    amount: 18400,
    owner: "Thomas Dad.",
    ownerImage: "https://i.pravatar.cc/32?img=1",
    activity: "call - 2 days",
    tags: "Design, B2B",
    date: "15 Sep, 2025",
  },
  {
    id: "2",
    dealName: "Projet Alpha - Design Phase",
    company: "La Fabrique",
    contact: "Julien Perrot",
    stage: "contacted",
    amount: 12700,
    owner: "Claire Brunet",
    ownerImage: "https://i.pravatar.cc/32?img=2",
    activity: "call - 2 days",
    tags: "Design, B2B",
  },
  {
    id: "3",
    dealName: "Résidence Moreau",
    company: "AEC Partners",
    contact: "Isabelle Moreau",
    stage: "proposal",
    amount: 24900,
    owner: "Thomas De...",
    ownerImage: "https://i.pravatar.cc/32?img=3",
    activity: "call - 2 days",
    tags: "Design, B2B",
    date: "15 Sep, 2025",
  },
  {
    id: "4",
    dealName: "Projet Résidence Rennes",
    company: "Indépendant",
    contact: "Marc Lefebvre",
    stage: "won",
    amount: 8000,
    owner: "Claire Brunet",
    ownerImage: "https://i.pravatar.cc/32?img=4",
    activity: "call - 2 days",
    tags: "Design, B2B",
    date: "15 Sep, 2025",
  },
  {
    id: "5",
    dealName: "Maison Dupont - Construction",
    company: "Groupe Orion",
    contact: "Sophie Lambert",
    stage: "lost",
    amount: 42500,
    owner: "Thomas De...",
    ownerImage: "https://i.pravatar.cc/32?img=5",
    activity: "call - 2 days",
    tags: "Design, B2B",
    date: "15 Sep, 2025",
  },
]

export default function DealsGridView() {
  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl font-semibold text-pretty">Deals Grid</h1>

      <GridView
        items={dealsData as Deal[]}
        groupBy={(d: Deal) => {
          switch (d.stage) {
            case "new":
              return "early-stage"
            case "contacted":
            case "proposal":
              return "in-progress"
            case "won":
              return "won"
            case "lost":
              return "lost"
            default:
              return String(d.stage)
          }
        }}
        order={["early-stage", "in-progress", "won", "lost"]}
        labels={{
          "early-stage": "Early Stage",
          "in-progress": "In-Progress",
          won: "Won",
          lost: "Lost",
        }}
        getAmount={(d: Deal) => d.amount}
        renderColumnAction={(key: any) => (
          <button
            className="inline-flex h-6 items-center rounded-md px-2 text-xs font-medium text-primary-foreground cursor-pointer"
            aria-label={`Add to ${key}`}
            // onClick={() => alert(`Add to ${key}`)}
          >
            +
          </button>
        )}
        columnHeaderClassName={(key: any) =>
          key === "lost" ? "bg-destructive/5" : key === "won" ? "bg-primary/5" : undefined
        }
        renderCard={(deal: Deal) => <DealCard deal={deal} />}
      />
    </main>
  )
}
