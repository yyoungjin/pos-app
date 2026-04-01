import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import OrderTableView from '../components/OrderTableView'
import OrderSlipView from '../components/OrderSlipView'
import {
  GAME_STAGE_ORDERS,
  GAME_MISSION_COUNT,
  GAME_ROUND_COUNT,
  buildClickMission,
  orderIdAndCategoryFromMenuKey,
} from '../data/gameStages'

const ROUND_COUNT = GAME_ROUND_COUNT
/** 과제 문구를 읽을 수 있도록 뷰 전 8초 대기 */
const INSTRUCTION_SECONDS = 8

const CATEGORY_BADGE_CLASS = {
  메인: 'bg-blue-100 text-blue-900 ring-blue-200/80',
  음료: 'bg-fuchsia-100 text-fuchsia-900 ring-fuchsia-200/80',
  사이드: 'bg-orange-100 text-orange-900 ring-orange-200/80',
}

/** 플레이 중 옆 패널: 클릭 순서·현재 단계 표시 */
function MissionPlaySidebar({ instruction, clickedCount }) {
  return (
    <aside
      className="shrink-0 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-md ring-1 ring-slate-900/5 sm:p-5 lg:sticky lg:top-4 lg:w-[min(100%,19rem)]"
      aria-label="이번 라운드 과제"
    >
      <div className="border-b border-slate-100 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">과제</p>
        <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">클릭 순서</h2>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-slate-600 sm:text-sm">{instruction.intro}</p>
      <ol className="mt-4 space-y-2.5 text-left">
        {instruction.bullets.map((item, i) => {
          const done = i < clickedCount
          const current = i === clickedCount
          return (
            <li
              key={`play-${i}-${item.title}-${item.categoryLabel}`}
              className={`flex gap-2.5 rounded-xl border px-3 py-2.5 sm:gap-3 sm:px-3.5 sm:py-3 ${
                done
                  ? 'border-emerald-200/80 bg-emerald-50/70'
                  : current
                    ? 'border-amber-400 bg-amber-50/90 shadow-sm ring-2 ring-amber-300/50'
                    : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 sm:text-sm ${
                  done
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                    : current
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                      : 'bg-slate-300 text-white ring-1 ring-slate-400/30'
                }`}
                aria-hidden
              >
                {done ? '✓' : i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-sm font-semibold ${done ? 'text-emerald-900' : 'text-slate-900'}`}>
                    {item.title}
                  </span>
                  <span
                    className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${CATEGORY_BADGE_CLASS[item.categoryLabel] ?? 'bg-slate-100 text-slate-800 ring-slate-200/80'}`}
                  >
                    {item.categoryLabel}
                  </span>
                  {current && (
                    <span className="text-[11px] font-semibold text-amber-800">← 다음</span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">{item.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 rounded-lg border border-amber-200/50 bg-amber-50/80 px-3 py-2 text-[11px] leading-relaxed text-amber-950/90 sm:text-xs">
        <span className="font-semibold text-amber-900">참고.</span> {instruction.note}
      </p>
    </aside>
  )
}

/** 표 뷰 4회 + 주문서 뷰 4회, 순서만 랜덤 */
function shuffleTableSlipSequence() {
  const arr = [...Array(4)].map(() => 'table').concat([...Array(4)].map(() => 'slip'))
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** 과제 4종을 각각 2번씩 총 8라운드에 배치, 순서만 랜덤 */
function shuffleMissionSequence() {
  const arr = [0, 1, 2, 3, 0, 1, 2, 3]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function GamePlayPage() {
  const viewSequence = useMemo(() => shuffleTableSlipSequence(), [])
  const missionSequence = useMemo(() => shuffleMissionSequence(), [])
  const [roundIndex, setRoundIndex] = useState(0)
  const [phase, setPhase] = useState('instruction')
  const [countdown, setCountdown] = useState(INSTRUCTION_SECONDS)
  const [clicked, setClicked] = useState([])
  const [pulseKey, setPulseKey] = useState(null)
  const [banner, setBanner] = useState(null)

  const phaseRef = useRef(phase)
  const stepsRef = useRef([])

  const missionIdx = missionSequence[roundIndex]
  const stageOrders = GAME_STAGE_ORDERS[missionIdx]
  const view = viewSequence[roundIndex]
  const mission = useMemo(() => buildClickMission(stageOrders, missionIdx), [stageOrders, missionIdx])
  const { instruction, steps } = mission

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    stepsRef.current = steps
  }, [steps])

  useEffect(() => {
    setPhase('instruction')
    setClicked([])
    setPulseKey(null)
    setBanner(null)
    setCountdown(INSTRUCTION_SECONDS)
  }, [roundIndex])

  useEffect(() => {
    if (phase !== 'instruction') return
    setCountdown(INSTRUCTION_SECONDS)
    let n = INSTRUCTION_SECONDS
    const id = window.setInterval(() => {
      n -= 1
      if (n <= 0) {
        window.clearInterval(id)
        setPhase('play')
        setCountdown(0)
        setBanner({
          variant: 'info',
          text: `과제 순서대로 주문서·카테고리에 맞는 메뉴를 클릭하세요. (${stepsRef.current.length}번)`,
        })
      } else {
        setCountdown(n)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase, roundIndex])

  const handleMenuClick = useCallback((key) => {
    const k = String(key)
    if (phaseRef.current !== 'play') return

    setClicked((prev) => {
      const missionSteps = stepsRef.current
      const expected = missionSteps[prev.length]
      const { orderId: clickedOrderId, category: clickedCategory } = orderIdAndCategoryFromMenuKey(k)

      if (
        clickedOrderId !== expected.orderId ||
        clickedCategory !== expected.category
      ) {
        setPulseKey(k)
        setBanner({
          variant: 'error',
          text: '틀렸습니다. 처음부터 다시 클릭해 주세요.',
        })
        window.setTimeout(() => setPulseKey(null), 700)
        window.setTimeout(() => {
          setBanner((b) => (b?.variant === 'error' ? null : b))
        }, 2800)
        return []
      }

      const next = [...prev, k]
      if (next.length < missionSteps.length) {
        setBanner({
          variant: 'success',
          text: `${next.length}번째 정답입니다. (${next.length}/${missionSteps.length})`,
        })
        window.setTimeout(() => {
          setBanner((b) => (b?.variant === 'success' ? null : b))
        }, 2200)
      } else {
        setBanner(null)
        window.setTimeout(() => setPhase('success'), 150)
      }
      return next
    })
  }, [])

  const goNextRound = () => {
    if (roundIndex < ROUND_COUNT - 1) {
      setRoundIndex((r) => r + 1)
    }
  }

  const playHud =
    phase === 'play' ? (
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-[min(100%-2rem,28rem)] -translate-x-1/2 flex-col gap-2 px-3">
        <div className="rounded-xl bg-slate-900/90 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg ring-1 ring-white/10">
          진행: <span className="tabular-nums font-bold text-amber-300">{clicked.length}</span> /{' '}
          <span className="tabular-nums">{steps.length}</span>
          <span className="ml-2 text-slate-400">· 클릭 가능</span>
        </div>
        {banner && (
          <div
            role="status"
            className={`pointer-events-none rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-lg ring-2 ${
              banner.variant === 'error'
                ? 'bg-rose-50 text-rose-900 ring-rose-400'
                : banner.variant === 'success'
                  ? 'bg-emerald-50 text-emerald-900 ring-emerald-400'
                  : 'bg-amber-50 text-amber-950 ring-amber-400'
            }`}
          >
            {banner.text}
          </div>
        )}
      </div>
    ) : null

  return (
    <main className="relative min-h-screen w-full bg-slate-100 px-3 py-2 text-slate-900 sm:px-4 sm:py-3">
      <header className="mb-2 flex w-full flex-wrap items-center justify-between gap-2 sm:mb-3">
        <h1 className="text-lg font-bold sm:text-xl">주문 파악 게임</h1>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="tabular-nums">
            라운드 {roundIndex + 1} / {ROUND_COUNT}
          </span>
          <span className="tabular-nums text-slate-500">
            · 과제 {missionIdx + 1} / {GAME_MISSION_COUNT}
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-white">
            {view === 'table' ? '표 뷰' : '주문서 뷰'}
          </span>
          <Link to="/tutorial" className="text-xs font-medium text-slate-500 underline hover:text-slate-800">
            튜토리얼
          </Link>
        </div>
      </header>

      {playHud}

      <div className="relative w-full">
        {phase === 'instruction' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/55 px-4 backdrop-blur-sm">
            <div className="max-w-xl rounded-2xl bg-white px-6 py-8 shadow-2xl ring-1 ring-slate-200 sm:px-8 sm:py-9">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">과제</p>
                <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">클릭 순서</h2>
              </div>
              <p className="mt-5 text-left text-[15px] leading-relaxed text-slate-600 sm:text-base">{instruction.intro}</p>
              <ol className="mt-6 space-y-4 text-left">
                {instruction.bullets.map((item, i) => (
                  <li
                    key={`${i}-${item.title}-${item.categoryLabel}`}
                    className="flex gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-sm ring-2 ring-amber-400/30 sm:h-10 sm:w-10 sm:text-base"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${CATEGORY_BADGE_CLASS[item.categoryLabel] ?? 'bg-slate-100 text-slate-800 ring-slate-200/80'}`}
                        >
                          {item.categoryLabel}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 rounded-xl border border-amber-200/60 bg-amber-50/90 px-4 py-3 text-left text-sm leading-relaxed text-amber-950/90">
                <span className="font-semibold text-amber-900">참고.</span> {instruction.note}
              </p>
              <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                <p className="text-5xl font-black tabular-nums text-amber-500">{countdown}</p>
                <p className="mt-2 text-sm text-slate-500">초 뒤에 주문 화면이 열립니다</p>
              </div>
            </div>
          </div>
        )}

        {phase === 'success' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-emerald-950/40 px-4 backdrop-blur-sm">
            <div className="max-w-md rounded-2xl bg-white px-6 py-8 text-center shadow-2xl">
              <p className="text-lg font-bold text-emerald-800">정답입니다!</p>
              <p className="mt-2 text-sm text-slate-600">
                {roundIndex < ROUND_COUNT - 1 ? '다음 라운드로 이동합니다.' : '모든 라운드를 완료했습니다.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {roundIndex < ROUND_COUNT - 1 ? (
                  <button
                    type="button"
                    onClick={goNextRound}
                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    다음 라운드
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    홈으로
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className={
            phase === 'play'
              ? 'relative z-20 flex flex-col-reverse gap-4 lg:flex-row lg:items-start lg:gap-5'
              : ''
          }
        >
          <div className={phase === 'play' ? 'min-w-0 flex-1' : ''}>
            {view === 'table' ? (
              <OrderTableView
                orders={stageOrders}
                menuNewestFirst={false}
                interactive={phase === 'play'}
                onMenuRowClick={handleMenuClick}
                selectedKeys={clicked}
                pulseKey={pulseKey}
              />
            ) : (
              <OrderSlipView
                orders={stageOrders}
                interactive={phase === 'play'}
                onMenuClick={handleMenuClick}
                selectedKeys={clicked}
                pulseKey={pulseKey}
              />
            )}
          </div>
          {phase === 'play' && (
            <MissionPlaySidebar instruction={instruction} clickedCount={clicked.length} />
          )}
        </div>
      </div>
    </main>
  )
}

export default GamePlayPage
