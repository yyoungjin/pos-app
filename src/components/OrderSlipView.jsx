import { mockOrders, ORDER_CATEGORIES, ORDER_STATUS } from '../data/mockOrders'

function sortByOldestOrder(a, b) {
  return a.orderTime.localeCompare(b.orderTime)
}

function sortByRecentOrder(a, b) {
  return b.orderTime.localeCompare(a.orderTime)
}

const PRIORITY_RANK = { FIRST: 1, SECOND: 2, THIRD: 3 }

function QueueCard({ order, menus, priorityRank }) {
  const isPriority = priorityRank >= PRIORITY_RANK.FIRST && priorityRank <= PRIORITY_RANK.THIRD

  const shellClass =
    priorityRank === PRIORITY_RANK.FIRST
      ? 'border-t-[3px] border-rose-700 bg-gradient-to-b from-rose-600 via-rose-500 to-rose-400 ring-rose-500/45 shadow-sm'
      : priorityRank === PRIORITY_RANK.SECOND
        ? 'border-t-2 border-rose-400 bg-gradient-to-b from-rose-300 via-rose-200 to-rose-100 ring-rose-300/50'
        : priorityRank === PRIORITY_RANK.THIRD
          ? 'border-t border-rose-200/80 bg-gradient-to-b from-white via-rose-50/90 to-rose-100/35 ring-rose-200/40'
          : 'border-t-0 bg-white ring-amber-200/80'

  const sizeClass =
    priorityRank === PRIORITY_RANK.FIRST
      ? 'min-h-[6.75rem] px-3 py-2.5'
      : priorityRank === PRIORITY_RANK.SECOND
        ? 'min-h-[5.85rem] px-2.5 py-2'
        : priorityRank === PRIORITY_RANK.THIRD
          ? 'min-h-[5.25rem] px-2.5 py-2'
          : 'min-h-[2.85rem] px-2 py-1.5'

  const bodyTextClass =
    priorityRank === PRIORITY_RANK.FIRST
      ? 'text-sm leading-snug'
      : priorityRank === PRIORITY_RANK.SECOND
        ? 'text-sm leading-snug'
        : priorityRank === PRIORITY_RANK.THIRD
          ? 'text-sm leading-snug'
          : 'text-[13px] leading-snug'

  const labelClass =
    priorityRank === PRIORITY_RANK.FIRST
      ? 'text-sm font-extrabold text-white drop-shadow-sm'
      : priorityRank === PRIORITY_RANK.SECOND
        ? 'text-xs font-extrabold text-rose-900'
        : priorityRank === PRIORITY_RANK.THIRD
          ? 'text-xs font-bold text-rose-600/85'
          : ''

  const listClass =
    priorityRank === PRIORITY_RANK.FIRST
      ? 'text-white/95'
      : priorityRank === PRIORITY_RANK.SECOND
        ? 'text-rose-950'
        : priorityRank === PRIORITY_RANK.THIRD
          ? 'text-slate-800'
          : 'text-slate-800'

  const metaClass =
    priorityRank === PRIORITY_RANK.FIRST
      ? 'text-rose-100'
      : priorityRank === PRIORITY_RANK.SECOND
        ? 'text-rose-800/90'
        : priorityRank === PRIORITY_RANK.THIRD
          ? 'text-slate-600'
          : 'text-slate-600'

  const lineClamp = isPriority ? '' : 'truncate'

  return (
    <article className={`flex h-full min-w-0 flex-col rounded-lg ring-1 ${sizeClass} ${bodyTextClass} ${shellClass}`}>
      {isPriority && <p className={`mb-1 shrink-0 ${labelClass}`}>우선 처리</p>}
      <ul className={`list-none space-y-1 ${listClass} min-h-0 flex-1`}>
        {menus.map((name, idx) => (
          <li key={`${name}-${idx}`} className={lineClamp} title={name}>
            {name}
          </li>
        ))}
      </ul>
      <div className={`mt-auto flex shrink-0 items-center justify-between gap-1 pt-1 text-xs ${metaClass}`}>
        <span className="font-medium">T{order.tableNumber}</span>
        <span>{order.orderTime}</span>
      </div>
    </article>
  )
}

/** 대기 우선순위와 대칭: 가장 최근 처리 3건을 강조 (파이프라인 왼쪽 = 막 도착) */
function ServedCard({ order, menus, freshRank }) {
  const isFresh = freshRank >= PRIORITY_RANK.FIRST && freshRank <= PRIORITY_RANK.THIRD

  const shellClass =
    freshRank === PRIORITY_RANK.FIRST
      ? 'border-t-[3px] border-emerald-800 bg-gradient-to-b from-emerald-600 via-emerald-500 to-emerald-400 ring-emerald-500/45 shadow-sm'
      : freshRank === PRIORITY_RANK.SECOND
        ? 'border-t-2 border-emerald-500 bg-gradient-to-b from-emerald-300 via-emerald-200 to-emerald-100 ring-emerald-300/50'
        : freshRank === PRIORITY_RANK.THIRD
          ? 'border-t border-emerald-200/90 bg-gradient-to-b from-white via-emerald-50/95 to-emerald-100/40 ring-emerald-200/45'
          : 'border-t-0 bg-white ring-emerald-200/80'

  const sizeClass =
    freshRank === PRIORITY_RANK.FIRST
      ? 'min-h-[6.75rem] px-3 py-2.5'
      : freshRank === PRIORITY_RANK.SECOND
        ? 'min-h-[5.85rem] px-2.5 py-2'
        : freshRank === PRIORITY_RANK.THIRD
          ? 'min-h-[5.25rem] px-2.5 py-2'
          : 'min-h-[2.85rem] px-2 py-1.5'

  const bodyTextClass =
    freshRank === PRIORITY_RANK.FIRST
      ? 'text-sm leading-snug'
      : freshRank === PRIORITY_RANK.SECOND
        ? 'text-sm leading-snug'
        : freshRank === PRIORITY_RANK.THIRD
          ? 'text-sm leading-snug'
          : 'text-[13px] leading-snug'

  const labelClass =
    freshRank === PRIORITY_RANK.FIRST
      ? 'text-sm font-extrabold text-white drop-shadow-sm'
      : freshRank === PRIORITY_RANK.SECOND
        ? 'text-xs font-extrabold text-emerald-950'
        : freshRank === PRIORITY_RANK.THIRD
          ? 'text-xs font-bold text-emerald-700/90'
          : ''

  const listClass =
    freshRank === PRIORITY_RANK.FIRST
      ? 'text-white/95'
      : freshRank === PRIORITY_RANK.SECOND
        ? 'text-emerald-950'
        : freshRank === PRIORITY_RANK.THIRD
          ? 'text-slate-800'
          : 'text-slate-800'

  const metaClass =
    freshRank === PRIORITY_RANK.FIRST
      ? 'text-emerald-100'
      : freshRank === PRIORITY_RANK.SECOND
        ? 'text-emerald-900/90'
        : freshRank === PRIORITY_RANK.THIRD
          ? 'text-slate-600'
          : 'text-slate-600'

  const lineClamp = isFresh ? '' : 'truncate'

  return (
    <article className={`flex h-full min-w-0 flex-col rounded-lg ring-1 ${sizeClass} ${bodyTextClass} ${shellClass}`}>
      {isFresh && <p className={`mb-1 shrink-0 ${labelClass}`}>방금 완료</p>}
      <ul className={`list-none space-y-1 ${listClass} min-h-0 flex-1`}>
        {menus.map((name, idx) => (
          <li key={`${name}-${idx}`} className={lineClamp} title={name}>
            {name}
          </li>
        ))}
      </ul>
      <div className={`mt-auto flex shrink-0 items-center justify-between gap-1 pt-1 text-xs ${metaClass}`}>
        <span className="font-medium">T{order.tableNumber}</span>
        <span>{order.orderTime}</span>
      </div>
    </article>
  )
}

/** 오래된 대기(우선) → 오른쪽: 오른쪽 3열 넓게 */
function buildPendingColumnTemplate(columnCount) {
  if (columnCount <= 0) return '1fr'
  return Array.from({ length: columnCount }, (_, colIndex) => {
    const fromRight = columnCount - 1 - colIndex
    if (fromRight === 0) return 'minmax(7.25rem, 1.55fr)'
    if (fromRight === 1) return 'minmax(6.5rem, 1.32fr)'
    if (fromRight === 2) return 'minmax(5.75rem, 1.12fr)'
    return 'minmax(3.85rem, 0.82fr)'
  }).join(' ')
}

/** 막 처리된 주문 → 왼쪽: 왼쪽 3열 넓게 (대기열과 거울 대칭) */
function buildServedColumnTemplate(columnCount) {
  if (columnCount <= 0) return '1fr'
  return Array.from({ length: columnCount }, (_, colIndex) => {
    if (colIndex === 0) return 'minmax(7.25rem, 1.55fr)'
    if (colIndex === 1) return 'minmax(6.5rem, 1.32fr)'
    if (colIndex === 2) return 'minmax(5.75rem, 1.12fr)'
    return 'minmax(3.85rem, 0.82fr)'
  }).join(' ')
}

function PendingTableHeaderRow({ displayPending, gridTemplateColumns, priorityRankByOrderId }) {
  if (displayPending.length === 0) return null

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns }} role="presentation">
      {displayPending.map((order) => {
        const rank = priorityRankByOrderId.get(order.id)
        const cellTone =
          rank === PRIORITY_RANK.FIRST
            ? 'bg-rose-200/80 text-rose-950 ring-rose-400/50'
            : rank === PRIORITY_RANK.SECOND
              ? 'bg-rose-100/90 text-rose-900 ring-rose-300/45'
              : rank === PRIORITY_RANK.THIRD
                ? 'bg-rose-50 text-rose-800 ring-rose-200/50'
                : 'bg-amber-200/50 text-amber-950 ring-amber-300/40'

        return (
          <div
            key={order.id}
            className={`flex min-h-8 min-w-0 items-center justify-center rounded-md px-0.5 text-center text-xs font-extrabold tabular-nums ring-1 ${cellTone}`}
          >
            T{order.tableNumber}
          </div>
        )
      })}
    </div>
  )
}

function ServedTableHeaderRow({ displayCompleted, gridTemplateColumns, freshRankByOrderId }) {
  if (displayCompleted.length === 0) return null

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns }} role="presentation">
      {displayCompleted.map((order) => {
        const rank = freshRankByOrderId.get(order.id)
        const cellTone =
          rank === PRIORITY_RANK.FIRST
            ? 'bg-emerald-300/85 text-emerald-950 ring-emerald-600/40'
            : rank === PRIORITY_RANK.SECOND
              ? 'bg-emerald-200/90 text-emerald-950 ring-emerald-500/35'
              : rank === PRIORITY_RANK.THIRD
                ? 'bg-emerald-100 text-emerald-900 ring-emerald-400/40'
                : 'bg-emerald-200/45 text-emerald-950 ring-emerald-300/45'

        return (
          <div
            key={order.id}
            className={`flex min-h-8 min-w-0 items-center justify-center rounded-md px-0.5 text-center text-xs font-extrabold tabular-nums ring-1 ${cellTone}`}
          >
            T{order.tableNumber}
          </div>
        )
      })}
    </div>
  )
}

function PendingLane({ category, displayPending, priorityRankByOrderId, gridTemplateColumns }) {
  return (
    <div className="min-h-0 shrink-0">
      <h3 className="text-sm font-bold tracking-tight text-slate-900">{category} 대기열</h3>
      <div className="mt-1 grid h-full auto-rows-fr gap-1" style={{ gridTemplateColumns }}>
        {displayPending.map((order) => {
          const menus = order.items[category]
          if (!menus?.length) {
            return (
              <div
                key={order.id}
                className="min-h-[2.85rem] rounded-lg border border-dashed border-amber-300/50 bg-amber-100/25"
                aria-hidden
              />
            )
          }
          return (
            <QueueCard
              key={order.id}
              order={order}
              menus={menus}
              priorityRank={priorityRankByOrderId.get(order.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function CompletedLane({ category, displayCompleted, freshRankByOrderId, gridTemplateColumns }) {
  return (
    <div className="min-h-0 min-w-0 shrink-0">
      <h3 className="text-sm font-bold tracking-tight text-slate-900">{category} · 서빙 완료</h3>
      <div className="mt-1 grid h-full auto-rows-fr gap-1" style={{ gridTemplateColumns }}>
        {displayCompleted.map((order) => {
          const menus = order.items[category]
          if (!menus?.length) {
            return (
              <div
                key={order.id}
                className="min-h-[2.85rem] rounded-lg border border-dashed border-emerald-300/50 bg-emerald-100/25"
                aria-hidden
              />
            )
          }
          return (
            <ServedCard
              key={order.id}
              order={order}
              menus={menus}
              freshRank={freshRankByOrderId.get(order.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function OrderSlipView() {
  const pendingOrders = mockOrders.filter((order) => order.status === ORDER_STATUS.ORDERED)
  const completedOrders = mockOrders.filter((order) => order.status === ORDER_STATUS.SERVED)

  const orderedPending = [...pendingOrders].sort(sortByOldestOrder)
  const displayPending = [...orderedPending].reverse()
  const priorityRankByOrderId = new Map(
    orderedPending.slice(0, 3).map((order, index) => [order.id, index + 1]),
  )
  const pendingGridTemplateColumns = buildPendingColumnTemplate(displayPending.length)

  const orderedCompleted = [...completedOrders].sort(sortByRecentOrder)
  const displayCompleted = orderedCompleted
  const freshRankByOrderId = new Map(
    orderedCompleted.slice(0, 3).map((order, index) => [order.id, index + 1]),
  )
  const servedGridTemplateColumns = buildServedColumnTemplate(displayCompleted.length)

  return (
    <section className="mx-auto flex w-full max-w-6xl min-h-0 flex-col rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 sm:p-2.5 md:h-[min(880px,calc(100svh-8.5rem))] md:overflow-hidden">
      <header className="mb-1.5 flex shrink-0 flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">주점 주문 관리 POS</h2>
        <p className="text-xs text-slate-500">
          대기 {pendingOrders.length} · 완료 {completedOrders.length}
        </p>
      </header>

      <div className="relative grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden rounded-xl ring-1 ring-slate-200/90 md:grid-cols-[minmax(0,2.1fr)_auto_minmax(0,1fr)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-amber-100/35 via-white to-emerald-100/35 md:from-amber-100/45 md:via-amber-50/20 md:to-emerald-100/45"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-3 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-300/60 to-transparent md:block"
        />

        <div className="relative flex min-h-0 min-w-0 flex-col gap-1.5 overflow-x-auto overflow-y-hidden p-2 md:p-2.5">
          <p className="shrink-0 text-xs font-bold uppercase tracking-wider text-amber-900/70">
            주문 대기
          </p>
          <PendingTableHeaderRow
            displayPending={displayPending}
            gridTemplateColumns={pendingGridTemplateColumns}
            priorityRankByOrderId={priorityRankByOrderId}
          />
          <div className="flex min-h-0 min-w-0 flex-col gap-8">
            {ORDER_CATEGORIES.map((category) => (
              <PendingLane
                key={category}
                category={category}
                displayPending={displayPending}
                priorityRankByOrderId={priorityRankByOrderId}
                gridTemplateColumns={pendingGridTemplateColumns}
              />
            ))}
          </div>
        </div>

        <div
          className="relative hidden w-9 shrink-0 flex-col items-center justify-center gap-0.5 self-stretch md:flex"
          aria-hidden
        >
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">처리</span>
          <div className="flex flex-col gap-0.5 text-emerald-600/80">
            <span className="text-xs" aria-hidden>
              →
            </span>
            <span className="text-xs" aria-hidden>
              →
            </span>
          </div>
        </div>

        <div className="relative flex min-h-0 min-w-0 flex-col gap-1.5 overflow-x-auto overflow-y-hidden border-t border-emerald-200/60 p-2 md:border-t-0 md:border-l md:border-emerald-200/50 md:p-2.5">
          <p className="shrink-0 text-xs font-bold uppercase tracking-wider text-emerald-900/75">
            서빙 완료
          </p>
          <ServedTableHeaderRow
            displayCompleted={displayCompleted}
            gridTemplateColumns={servedGridTemplateColumns}
            freshRankByOrderId={freshRankByOrderId}
          />
          <div className="flex min-h-0 min-w-0 flex-col gap-8">
            {ORDER_CATEGORIES.map((category) => (
              <CompletedLane
                key={category}
                category={category}
                displayCompleted={displayCompleted}
                freshRankByOrderId={freshRankByOrderId}
                gridTemplateColumns={servedGridTemplateColumns}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderSlipView
