import { mockOrders, ORDER_CATEGORIES } from '../data/mockOrders'
import OrderStatusBadge from './OrderStatusBadge'

/** 상태 뱃지와 동일한 pill 스타일로 카테고리 구분 */
const categoryBadgeClass = {
  메인: 'bg-blue-100 text-blue-900 ring-1 ring-inset ring-blue-200',
  사이드: 'bg-orange-100 text-orange-900 ring-1 ring-inset ring-orange-200',
  음료: 'bg-fuchsia-100 text-fuchsia-900 ring-1 ring-inset ring-fuchsia-200',
}

function CategoryBadge({ category }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${categoryBadgeClass[category] ?? 'bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200'}`}
    >
      {category}
    </span>
  )
}

/** 같은 테이블 번호 → 항상 동일한 색 (숫자 테이블은 순환, 그 외는 문자열 해시) */
const TABLE_BADGE_CLASSES = [
  'bg-violet-100 text-violet-900 ring-1 ring-inset ring-violet-200',
  'bg-sky-100 text-sky-900 ring-1 ring-inset ring-sky-200',
  'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200',
  'bg-rose-100 text-rose-900 ring-1 ring-inset ring-rose-200',
  'bg-teal-100 text-teal-900 ring-1 ring-inset ring-teal-200',
  'bg-indigo-100 text-indigo-900 ring-1 ring-inset ring-indigo-200',
  'bg-cyan-100 text-cyan-900 ring-1 ring-inset ring-cyan-200',
  'bg-lime-100 text-lime-900 ring-1 ring-inset ring-lime-200',
  'bg-pink-100 text-pink-900 ring-1 ring-inset ring-pink-200',
  'bg-stone-200 text-stone-900 ring-1 ring-inset ring-stone-300',
]

function tableBadgePaletteIndex(tableNumber) {
  const s = String(tableNumber).trim()
  const asNum = Number.parseInt(s, 10)
  if (Number.isFinite(asNum) && String(asNum) === s) {
    return Math.abs(asNum) % TABLE_BADGE_CLASSES.length
  }
  let h = 0
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h % TABLE_BADGE_CLASSES.length
}

function TableNumberBadge({ tableNumber }) {
  const cls = TABLE_BADGE_CLASSES[tableBadgePaletteIndex(tableNumber)]
  return (
    <span className={`inline-flex min-w-[2.25rem] justify-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${cls}`}>
      {tableNumber}
    </span>
  )
}

/** 최신 주문이 위로 오도록 정렬한 뒤, 주문·카테고리 순으로 한 메뉴 = 한 행 */
function buildMenuRows(orders) {
  const sorted = [...orders].sort((a, b) => b.orderTime.localeCompare(a.orderTime))
  const rows = []
  for (const order of sorted) {
    for (const category of ORDER_CATEGORIES) {
      const menus = order.items[category] ?? []
      menus.forEach((menuName, idx) => {
        rows.push({
          key: `${order.id}-${category}-${idx}`,
          order,
          category,
          menuName,
        })
      })
    }
  }
  return rows
}

function OrderTableView() {
  const rows = buildMenuRows(mockOrders)

  return (
    <section className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">주점 주문 관리 POS</h2>
          <p className="mt-1 text-sm text-slate-600">
            엑셀형 표 뷰 - 메뉴 한 줄이 한 행 · 주문은 시간·테이블·상태가 행마다 반복 · 최신 주문이 위쪽
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <div>메뉴 행 {rows.length}줄</div>
          <div className="text-xs text-slate-400">주문 {mockOrders.length}건</div>
        </div>
      </header>

      <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-800">
            <tr>
              <th className="border border-slate-300 px-3 py-2 font-semibold">주문 시간</th>
              <th className="border border-slate-300 px-3 py-2 font-semibold">테이블</th>
              <th className="border border-slate-300 px-3 py-2 text-center font-semibold">카테고리</th>
              <th className="border border-slate-300 px-3 py-2 font-semibold">메뉴</th>
              <th className="border border-slate-300 px-3 py-2 font-semibold">상태</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map(({ key, order, category, menuName }) => (
              <tr key={key} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap border border-slate-200 px-3 py-2 tabular-nums text-slate-700">
                  {order.orderTime}
                </td>
                <td className="whitespace-nowrap border border-slate-200 px-3 py-2 text-center">
                  <TableNumberBadge tableNumber={order.tableNumber} />
                </td>
                <td className="whitespace-nowrap border border-slate-200 px-3 py-2 text-center">
                  <CategoryBadge category={category} />
                </td>
                <td className="border border-slate-200 px-3 py-2 text-slate-900">{menuName}</td>
                <td className="border border-slate-200 px-3 py-2">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default OrderTableView
