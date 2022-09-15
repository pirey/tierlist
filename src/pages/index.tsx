import type { NextPage } from "next"
import Head from "next/head"
import React from "react"
import * as ReactDOM from "react-dom/client"

type Item = {
  label?: string
  imgSrc?: string
}

type Tier = {
  label: string
  order?: number
  color?: string
  colorClass?: string
  items: Set<Item>
}

// TODO: weird border when droppable
const Tier: React.FC<{ tier: Tier }> = ({ tier }) => {
  return (
    <div className="tier flex flex-row">
      <div
        className={`flex items-center justify-center font-bold w-24 h-24 ${tier.colorClass}`}
      >
        {tier.label}
      </div>
      <div className="flex-grow flex flex-row box-border px-1 bg-slate-300 border-b border-b-slate-400">
        {Array.from(tier.items).map((item) => (
          <Item key={item.label} item={item} />
        ))}
      </div>
    </div>
  )
}

const DroppableTier: React.FC<{
  tier: Tier
  onDropItem?: (tier: Tier) => void
}> = ({ tier, onDropItem }) => {
  return (
    <Droppable
      className="border-0"
      onDragLeave={(e) => {
        e.preventDefault()
        console.log("leave")
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        console.log("over")
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDropItem?.(tier)
        console.log("drop")
      }}
    >
      <Tier tier={tier} />
    </Droppable>
  )
}

const TierList: React.FC<{
  tierlist: Tier[]
  onDropItem: (tier: Tier) => void
}> = ({ tierlist, onDropItem }) => {
  return (
    <div className="tierlist flex flex-col flex-grow basis-0">
      {tierlist.map((tier) => (
        <DroppableTier key={tier.label} tier={tier} onDropItem={onDropItem} />
      ))}
    </div>
  )
}

const Item: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <div
      title={item.label}
      className="candidate w-24 h-24 bg-top bg-cover bg-origin-border flex justify-center items-center"
      style={{
        backgroundImage: `url(${item.imgSrc})`,
      }}
    >
      {item.imgSrc ? "" : item.label}
    </div>
  )
}

const createDisposableDragImage = (item: Item): HTMLDivElement => {
  const dragImage = document.createElement("div")
  dragImage.className = "disposable-drag-image"
  dragImage.style.position = "absolute"
  dragImage.style.top = "-9999px"
  document.body.append(dragImage)
  ReactDOM.createRoot(dragImage).render(<Item item={item} />)
  return dragImage
}

const disposeDragImage = () => {
  document.body.querySelector(".disposable-drag-image")?.remove()
}

const DraggableItem: React.FC<{
  item: Item
  onDragItem?: (item: Item) => void
  onUndragItem?: () => void
}> = ({ item, onDragItem, onUndragItem }) => {
  return (
    <Draggable
      key={item.label}
      className={`w-24 h-24 mx-1`}
      onDragStart={(e) => {
        const dragImage = createDisposableDragImage(item)
        e.dataTransfer.setDragImage(dragImage, 0, 0)
        onDragItem?.(item)
      }}
      onDragEnd={() => {
        disposeDragImage()
        onUndragItem?.()
      }}
    >
      <Item item={item} />
    </Draggable>
  )
}

const CandidateList: React.FC<{
  candidatelist: Set<Item>
  onDragItem?: (item: Item) => void
  onUndragItem?: () => void
}> = ({ candidatelist, onDragItem, onUndragItem }) => {
  return (
    <div className="candidatelist px-1 flex-grow flex flex-row basis-0">
      {Array.from(candidatelist).map((item) => (
        <DraggableItem
          key={item.label}
          item={item}
          onDragItem={onDragItem}
          onUndragItem={onUndragItem}
        />
      ))}
    </div>
  )
}

const Separator = () => {
  return <div className="separator"></div>
}

const SettingButton = () => {
  return (
    <i className="cursor-pointer p-2 rounded hover:bg-slate-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </i>
  )
}

const DownloadButton = () => {
  return (
    <i className="cursor-pointer p-2 rounded hover:bg-slate-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </i>
  )
}

const ResetButton = () => {
  return (
    <i className="cursor-pointer p-2 rounded hover:bg-slate-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </i>
  )
}

const GithubButton = () => {
  return (
    <a
      href="https://github.com/pirey/tierlist"
      target="__blank"
      rel="noreferrer noopener"
      className="cursor-pointer p-2 rounded hover:bg-slate-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    </a>
  )
}

const Toolbar: React.FC<{
  selectTemplate?: () => void
  openSetting?: () => void
}> = ({ selectTemplate, openSetting }) => {
  return (
    <div className="toolbar flex flex-col items-center w-14 py-2">
      <SettingButton />
      <div className="pb-2"></div>
      <ResetButton />
      <div className="pb-2"></div>
      <DownloadButton />
      <div className="pb-2"></div>
      <GithubButton />
    </div>
  )
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout flex flex-row w-screen h-screen overflow-hidden bg-slate-100">
      {children}
    </div>
  )
}

const Home: NextPage = () => {
  const [tierlist, setTierlist] = React.useState<Tier[]>([
    {
      label: "S",
      colorClass: "bg-indigo-500 text-white",
      items: new Set([
        {
          label: "Vivo",
          imgSrc: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y16.jpg",
        },
      ]),
    },
    {
      label: "A",
      colorClass: "bg-sky-500 text-white",
      items: new Set([]),
    },
    {
      label: "B",
      colorClass: "bg-green-500 text-white",
      items: new Set([]),
    },
    {
      label: "C",
      colorClass: "bg-lime-500 text-white",
      items: new Set([]),
    },
    {
      label: "D",
      colorClass: "bg-yellow-500 text-white",
      items: new Set([]),
    },
    {
      label: "E",
      colorClass: "bg-orange-500 text-white",
      items: new Set([]),
    },
    {
      label: "F",
      colorClass: "bg-red-500 text-white",
      items: new Set([]),
    },
  ])

  const [candidatelist, setCandidatelist] = React.useState<Set<Item>>(
    new Set([
      {
        label: "Item 1",
        imgSrc: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z6-lite-5g.jpg",
      },
      {
        label: "Item 2",
        imgSrc: "https://fdn2.gsmarena.com/vv/bigpic/realme-c30s.jpg",
      },
      {
        label: "Item 3",
        imgSrc: "https://fdn2.gsmarena.com/vv/bigpic/oppo-k10x-.jpg",
      },
    ])
  )

  const [draggedItem, setDraggedItem] = React.useState<Item | null>(null)

  const dragItem = (item: Item) => {
    setDraggedItem(item)
  }

  const undragItem = () => {
    setDraggedItem(null)
  }

  const removeItemFromCandidatelist = (item: Item) => {
    candidatelist.delete(item)
    setCandidatelist(candidatelist)
  }

  const addItemToTier = (tier: Tier, item: Item) => ({
    ...tier,
    items: new Set([...Array.from(tier.items), item]),
  })

  const addItemToTierlist = (tier: Tier) => {
    if (!draggedItem) return
    setTierlist(
      tierlist.map((t) =>
        t.label === tier.label ? addItemToTier(t, draggedItem) : t
      )
    )
    removeItemFromCandidatelist(draggedItem)
    setDraggedItem(null)
    disposeDragImage()
  }

  return (
    <>
      <Head>
        <title>Tier List</title>
        <meta name="description" content="Create tier list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Toolbar />
        <CandidateList
          candidatelist={candidatelist}
          onDragItem={dragItem}
          onUndragItem={undragItem}
        />
        <Separator />
        <TierList tierlist={tierlist} onDropItem={addItemToTierlist} />
      </Layout>
    </>
  )
}

export default Home

type DraggableProps = {
  children: React.ReactNode
  className?: string
  onDragStart?: React.DragEventHandler
  onDragEnd?: React.DragEventHandler
}
export const Draggable: React.FC<DraggableProps> = ({
  children,
  className = "",
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`draggable ${className}`}
    >
      {children}
    </div>
  )
}

export const Droppable: React.FC<{
  onDragLeave: React.DragEventHandler
  onDragOver: React.DragEventHandler
  onDrop: React.DragEventHandler
  children: React.ReactNode
  className?: string
}> = ({ onDragLeave, onDragOver, onDrop, children, className = "" }) => {
  // the drag event will be fired for each child inside the droppable parent
  // this counter is needed to properly tell that the user has left the parent
  const [dragEnterCounter, setDragEnterCounter] = React.useState<number>(0)

  return (
    <div
      className={`droppable ${className}`}
      onDragEnter={() => {
        setDragEnterCounter(dragEnterCounter + 1)
      }}
      onDragLeave={(e) => {
        const nextDragEnterCounter = dragEnterCounter - 1
        setDragEnterCounter(nextDragEnterCounter)

        if (nextDragEnterCounter <= 0) {
          onDragLeave(e)
        }
      }}
      onDragOver={onDragOver}
      onDrop={(e) => {
        // reset the counter since the drag event has "finished"
        setDragEnterCounter(0)
        onDrop(e)
      }}
    >
      {children}
    </div>
  )
}
