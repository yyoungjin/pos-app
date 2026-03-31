import { useState } from 'react'
import OrderGridView from './OrderGridView'
import OrderSlipView from './OrderSlipView'
import OrderTableView from './OrderTableView'

const VIEW_TYPE = {
  TABLE: 'table',
  GRID: 'grid',
  SLIP: 'slip',
}

function PosViewExperiment() {
  const [viewType, setViewType] = useState(VIEW_TYPE.GRID)

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto mb-4 flex w-full max-w-6xl items-center justify-between gap-3">
        <h1 className="text-lg font-bold sm:text-xl">POS UI 비교 실험 - 화면 1/2</h1>
        <div className="inline-flex rounded-lg bg-white p-1 ring-1 ring-slate-200">
          <button
            type="button"
            onClick={() => setViewType(VIEW_TYPE.TABLE)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${viewType === VIEW_TYPE.TABLE ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            표 뷰
          </button>
          <button
            type="button"
            onClick={() => setViewType(VIEW_TYPE.GRID)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${viewType === VIEW_TYPE.GRID ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            테이블 그리드 뷰
          </button>
          <button
            type="button"
            onClick={() => setViewType(VIEW_TYPE.SLIP)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${viewType === VIEW_TYPE.SLIP ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            주문서 뷰
          </button>
        </div>
      </section>

      {viewType === VIEW_TYPE.TABLE && <OrderTableView />}
      {viewType === VIEW_TYPE.GRID && <OrderGridView />}
      {viewType === VIEW_TYPE.SLIP && <OrderSlipView />}
    </main>
  )
}

export default PosViewExperiment
