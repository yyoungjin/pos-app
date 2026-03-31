import { mockOrders } from '../data/mockOrders'
import OrderStatusBadge from './OrderStatusBadge'

function OrderTableView() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">주점 주문 관리 POS</h1>
            <p className="mt-1 text-sm text-slate-600">
              엑셀형 표 뷰 - 주문 진행상황 빠른 파악용
            </p>
          </div>
          <div className="text-sm text-slate-500">총 {mockOrders.length}건</div>
        </header>

        <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">
                  메뉴명
                </th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">
                  주문 시간
                </th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">
                  테이블 번호
                </th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="border-b border-slate-100 px-4 py-3">
                    {order.menuName}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-700">
                    {order.orderTime}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    {order.tableNumber}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default OrderTableView
