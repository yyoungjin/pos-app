import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import OrderTableView from '../components/OrderTableView'
import OrderSlipView from '../components/OrderSlipView'
import { GAME_STAGE_ORDERS, buildClickMission, orderIdAndCategoryFromMenuKey } from '../data/gameStages'

const STAGE_COUNT = 8
/** 과제 문구를 읽을 수 있도록 뷰 전 8초 대기 */
const INSTRUCTION_SECONDS = 8

function shuffleTableSlipSequence() {
  const arr = [...Array(4)].map(() => 'table').concat([...Array(4)].map(() => 'slip'))
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function GamePlayPage() {
  const viewSequence = useMemo(() => shuffleTableSlipSequence(), [])
  const [stageIndex, setStageIndex] = useState(0)
  const [phase, setPhase] = useState('instruction')
  const [countdown, setCountdown] = useState(INSTRUCTION_SECONDS)
  const [clicked, setClicked] = useState([])
  const [pulseKey, setPulseKey] = useState(null)
  const [banner, setBanner] = useState(null)

  const phaseRef = useRef(phase)
  const stepsRef = useRef([])

  const stageOrders = GAME_STAGE_ORDERS[stageIndex]
  const view = viewSequence[stageIndex]
  const mission = useMemo(() => buildClickMission(stageOrders), [stageOrders])
  const { intent, steps } = mission

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
  }, [stageIndex])

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
  }, [phase, stageIndex])

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

  const goNextStage = () => {
    if (stageIndex < STAGE_COUNT - 1) {
      setStageIndex((s) => s + 1)
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
    <main className="relative min-h-screen bg-slate-100 px-2 py-3 text-slate-900 sm:px-3 sm:py-4">
      <header className="mx-auto mb-3 flex w-full max-w-6xl flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold sm:text-xl">주문 파악 게임</h1>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="tabular-nums">
            스테이지 {stageIndex + 1} / {STAGE_COUNT}
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

      <div className="relative mx-auto max-w-6xl">
        {phase === 'instruction' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/55 px-4 backdrop-blur-sm">
            <div className="max-w-lg rounded-2xl bg-white px-6 py-8 text-center shadow-2xl ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">과제</p>
              <p className="mt-3 whitespace-pre-line text-base font-medium leading-relaxed text-slate-900">
                {intent}
              </p>
              <p className="mt-8 text-5xl font-black tabular-nums text-amber-500">{countdown}</p>
              <p className="mt-2 text-sm text-slate-500">초 뒤에 주문 화면이 열립니다</p>
            </div>
          </div>
        )}

        {phase === 'success' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-emerald-950/40 px-4 backdrop-blur-sm">
            <div className="max-w-md rounded-2xl bg-white px-6 py-8 text-center shadow-2xl">
              <p className="text-lg font-bold text-emerald-800">정답입니다!</p>
              <p className="mt-2 text-sm text-slate-600">
                {stageIndex < STAGE_COUNT - 1 ? '다음 스테이지로 이동합니다.' : '모든 스테이지를 완료했습니다.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {stageIndex < STAGE_COUNT - 1 ? (
                  <button
                    type="button"
                    onClick={goNextStage}
                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    다음 스테이지
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

        <div className={phase === 'play' ? 'relative z-20' : ''}>
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
      </div>
    </main>
  )
}

export default GamePlayPage
