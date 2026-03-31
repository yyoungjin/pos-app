import { mockOrders, ORDER_CATEGORIES } from '../data/mockOrders'
import OrderStatusBadge from './OrderStatusBadge'

function CategoryCell({ menus }) {
  if (!menus?.length) {
    return <span className="text-slate-400">—</span>
  }
  return (
    <ul className="list-none space-y-1.5">
      {menus.map((name, idx) => (
        <li
          key={`${name}-${idx}`}
          className="rounded-md border border-slate-200 bg-slate-50/80 px-2 py-1 text-slate-900"
        >
          {name}
        </li>
      ))}
    </ul>
  )
}

function OrderTableView() {
  const rows = [...mockOrders].sort((a, b) => b.orderTime.localeCompare(a.orderTime))

  return (
    <section className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">주점 주문 관리 POS</h2>
          <p className="mt-1 text-sm text-slate-600">
            엑셀형 표 뷰 - 열(칼럼)으로 카테고리 구분 · 최신 주문이 위쪽
          </p>
        </div>
        <div className="text-sm text-slate-500">총 {mockOrders.length}건</div>
      </header>

      <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
        <table className="min-w-full border-collapse text-left text-base">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="border-b border-slate-200 px-4 py-3 font-semibold">주문 시간</th>
              <th className="border-b border-slate-200 px-4 py-3 font-semibold">테이블 번호</th>
              {ORDER_CATEGORIES.map((category) => (
                <th
                  key={category}
                  className="border-b border-slate-200 bg-amber-50/60 px-4 py-3 font-semibold text-slate-900"
                >
                  {category}
                </th>
              ))}
              <th className="border-b border-slate-200 px-4 py-3 font-semibold">상태</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-medium text-slate-700">
                  {order.orderTime}
                </td>
                <td className="border-b border-slate-100 px-4 py-3">{order.tableNumber}</td>
                {ORDER_CATEGORIES.map((category) => (
                  <td
                    key={category}
                    className="align-top border-b border-slate-100 px-4 py-3 bg-amber-50/30"
                  >
                    <CategoryCell menus={order.items[category]} />
                  </td>
                ))}
                <td className="border-b border-slate-100 px-4 py-3">
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
