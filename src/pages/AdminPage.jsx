import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import mockUserResponses from '../data/adminMockUserResponses.json'

function averageMs(values) {
  if (!values.length) return 0
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

function clickAccuracy(totalTasks, totalMisclicks) {
  if (!totalTasks) return 0
  return Math.round((totalTasks / (totalTasks + totalMisclicks)) * 100)
}

const TASK_ORDER = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06']

function buildLinePath(values, width, height, min, max) {
  if (!values.length) return ''
  const safeMax = max === min ? max + 1 : max
  return values
    .map((value, idx) => {
      const x = (idx / (values.length - 1 || 1)) * width
      const y = height - ((value - min) / (safeMax - min)) * height
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function buildTaskOrderedSequence(sequence) {
  return TASK_ORDER.map((taskId) => {
    const rows = sequence.filter((r) => r.taskId === taskId)
    const taskLabel = rows[0]?.taskLabel ?? taskId
    return {
      key: taskId,
      label: taskId,
      taskLabel,
      excelValue: averageMs(rows.map((r) => r.excelView.responseTimeMs)),
      gridValue: averageMs(rows.map((r) => r.gridView.responseTimeMs)),
    }
  })
}

function TrendChart({ points, xLabel }) {
  const width = 320
  const height = 120
  const excel = points.map((p) => p.excelValue)
  const grid = points.map((p) => p.gridValue)
  const all = [...excel, ...grid]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const excelPath = buildLinePath(excel, width, height, min, max)
  const gridPath = buildLinePath(grid, width, height, min, max)

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full">
        <path d={excelPath} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeDasharray="6 4" />
        <path d={gridPath} fill="none" stroke="#16a34a" strokeWidth="2.5" />
      </svg>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-5 bg-slate-900" />
          엑셀뷰
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-5 bg-green-600" />
          그리드뷰
        </span>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
        {points.map((p) => (
          <span key={p.key}>
            {p.label}
          </span>
        ))}
      </div>
      <div className="mt-1 text-xs text-slate-500">x축: {xLabel}, y축: 응답시간(ms)</div>
    </div>
  )
}

function FatigueOverviewChart({ users }) {
  const points = users.map((user) => ({
    key: user.userId,
    label: user.userId,
    excelValue: Math.max(1, Math.min(5, user.fatigue?.excelView ?? 3)),
    gridValue: Math.max(1, Math.min(5, user.fatigue?.gridView ?? 3)),
  }))
  const width = 640
  const height = 180
  const excel = points.map((p) => p.excelValue)
  const grid = points.map((p) => p.gridValue)
  const excelPath = buildLinePath(excel, width, height, 1, 5)
  const gridPath = buildLinePath(grid, width, height, 1, 5)

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <h3 className="mb-2 text-sm font-semibold text-slate-800">종료 후 피로도 그래프 (1~5)</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
        <path d={excelPath} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeDasharray="6 4" />
        <path d={gridPath} fill="none" stroke="#16a34a" strokeWidth="2.5" />
      </svg>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-5 bg-slate-900" />
          엑셀뷰 피로도
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-5 bg-green-600" />
          그리드뷰 피로도
        </span>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
        {points.map((p) => (
          <span key={`f-${p.key}`}>{p.label}</span>
        ))}
      </div>
      <div className="mt-1 text-xs text-slate-500">x축: 유저, y축: 피로도(1~5)</div>
    </div>
  )
}

function AdminPage() {
  const [viewMode, setViewMode] = useState('table')

  const users = useMemo(() => {
    return mockUserResponses.map((user) => {
      const sequence = user.quizSequence
      const excelAvg = averageMs(sequence.map((r) => r.excelView.responseTimeMs))
      const gridAvg = averageMs(sequence.map((r) => r.gridView.responseTimeMs))
      const excelMisclickTotal = sequence.reduce((sum, r) => sum + r.excelView.misclickCount, 0)
      const gridMisclickTotal = sequence.reduce((sum, r) => sum + r.gridView.misclickCount, 0)
      return {
        ...user,
        excelAvg,
        gridAvg,
        excelMisclickTotal,
        gridMisclickTotal,
        excelAccuracy: clickAccuracy(sequence.length, excelMisclickTotal),
        gridAccuracy: clickAccuracy(sequence.length, gridMisclickTotal),
      }
    })
  }, [])

  return (
    <main className="min-h-screen w-full bg-slate-100 px-3 py-3 text-slate-900 sm:px-4 sm:py-4">
      <section className="mb-3 flex w-full flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold sm:text-xl">관리자 페이지</h1>
          <p className="text-sm text-slate-600">유저별 응답 데이터</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            홈
          </Link>
          <Link
            to="/game"
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            게임
          </Link>
        </div>
      </section>

      <section className="mb-3 rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:p-4">
        <p className="mb-2 text-sm text-slate-600">
          각 유저는 6개 태스크를 랜덤 순서로 1회씩 수행하며, 각 태스크에서 엑셀/그리드 두 뷰를 비교합니다.
        </p>
        <div className="inline-flex rounded-lg bg-slate-100 p-1 ring-1 ring-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            표 보기
          </button>
          <button
            type="button"
            onClick={() => setViewMode('graph')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              viewMode === 'graph' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            그래프 보기
          </button>
          <button
            type="button"
            onClick={() => setViewMode('fatigue')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              viewMode === 'fatigue' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            피로도 보기
          </button>
        </div>
      </section>

      {viewMode === 'graph' && (
        <section className="space-y-3">
          {users.map((user) => (
            <article key={user.userId} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h2 className="text-base font-bold text-slate-900">{user.userId}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  그룹 {user.participantGroup}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  엑셀 {user.excelAvg}ms / 그리드 {user.gridAvg}ms
                </span>
                <span className="text-xs font-medium text-slate-600">
                  엑셀 정답률 {user.excelAccuracy}% · 그리드 정답률 {user.gridAccuracy}%
                </span>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-slate-800">문제번호 순서 그래프</h3>
                  <TrendChart
                    points={buildTaskOrderedSequence(user.quizSequence)}
                    xLabel="문제번호(T01~T06)"
                  />
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-semibold text-slate-800">풀이 순서 그래프</h3>
                  <TrendChart
                    points={user.quizSequence.map((round) => ({
                      key: `r-${round.round}`,
                      label: `R${round.round}`,
                      excelValue: round.excelView.responseTimeMs,
                      gridValue: round.gridView.responseTimeMs,
                    }))}
                    xLabel="실제 풀이 순서(라운드 1~6)"
                  />
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                실제 풀이 순서: {user.quizSequence.map((round) => round.taskId).join(' → ')}
              </div>
            </article>
          ))}
        </section>
      )}

      {viewMode === 'fatigue' && (
        <section className="space-y-3">
          <article className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <FatigueOverviewChart users={users} />
          </article>
        </section>
      )}

      {viewMode === 'table' && (
        <section className="space-y-3">
          {users.map((user) => (
            <article key={user.userId} className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              <header className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-100 px-4 py-3">
                <h2 className="text-base font-bold text-slate-900">{user.userId}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  그룹 {user.participantGroup}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  엑셀뷰 정답률 {user.excelAccuracy}% (오클릭 {user.excelMisclickTotal}회)
                </span>
                <span className="text-xs font-medium text-slate-600">
                  그리드뷰 정답률 {user.gridAccuracy}% (오클릭 {user.gridMisclickTotal}회)
                </span>
                <span className="text-xs font-medium text-slate-600">엑셀 평균 {user.excelAvg}ms</span>
                <span className="text-xs font-medium text-slate-600">그리드 평균 {user.gridAvg}ms</span>
              </header>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Round / Task</th>
                      <th className="px-4 py-2.5 font-semibold">엑셀뷰</th>
                      <th className="px-4 py-2.5 font-semibold">그리드뷰</th>
                      <th className="px-4 py-2.5 font-semibold">차이 (엑셀-그리드)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.quizSequence.map((response) => {
                      const diffMs = response.excelView.responseTimeMs - response.gridView.responseTimeMs
                      return (
                        <tr key={`${user.userId}-${response.round}`} className="border-t border-slate-100">
                          <td className="px-4 py-2.5 text-slate-800">
                            <div className="font-semibold">
                              R{response.round} - {response.taskId}
                            </div>
                            <div className="text-xs text-slate-500">{response.taskLabel}</div>
                          </td>
                          <td className="px-4 py-2.5 text-slate-700">
                            <div>{response.excelView.responseTimeMs}ms</div>
                            <div className="mt-1 text-xs text-slate-500">
                              오클릭 {response.excelView.misclickCount}회
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-slate-700">
                            <div>{response.gridView.responseTimeMs}ms</div>
                            <div className="mt-1 text-xs text-slate-500">
                              오클릭 {response.gridView.misclickCount}회
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-slate-700">
                            <span
                              className={`font-semibold ${
                                diffMs > 0 ? 'text-emerald-700' : diffMs < 0 ? 'text-rose-700' : 'text-slate-700'
                              }`}
                            >
                              {diffMs > 0 ? '+' : ''}
                              {diffMs}ms
                            </span>
                            <div className="text-xs text-slate-500">
                              {diffMs > 0
                                ? `그리드뷰가 ${(diffMs / 1000).toFixed(2)}초 빠름`
                                : diffMs < 0
                                  ? `엑셀뷰가 ${(Math.abs(diffMs) / 1000).toFixed(2)}초 빠름`
                                  : '동일'}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default AdminPage
