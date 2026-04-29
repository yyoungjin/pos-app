import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'adminMockUserResponses.json')

const USERS = [
  { userId: 'U-001', participantGroup: 'A' },
  { userId: 'U-002', participantGroup: 'A' },
  { userId: 'U-003', participantGroup: 'B' },
  { userId: 'U-004', participantGroup: 'B' },
  { userId: 'U-005', participantGroup: 'A' },
  { userId: 'U-006', participantGroup: 'B' },
  { userId: 'U-007', participantGroup: 'A' },
  { userId: 'U-008', participantGroup: 'B' },
  { userId: 'U-009', participantGroup: 'A' },
  { userId: 'U-010', participantGroup: 'B' },
  { userId: 'U-011', participantGroup: 'A' },
  { userId: 'U-012', participantGroup: 'B' },
]

const TASKS = [
  { taskId: 'T01', taskLabel: '가장 최근 메인 메뉴 찾기', baseMs: 4700, difficulty: 1.0 },
  { taskId: 'T02', taskLabel: '테이블 4의 음료 선택', baseMs: 5100, difficulty: 1.08 },
  { taskId: 'T03', taskLabel: '서빙 완료된 사이드 찾기', baseMs: 5600, difficulty: 1.22 }, // 공통 고난도
  { taskId: 'T04', taskLabel: '가장 오래 대기한 주문 찾기', baseMs: 5400, difficulty: 1.15 }, // 공통 고난도
  { taskId: 'T05', taskLabel: '테이블 2의 메인 메뉴 찾기', baseMs: 5000, difficulty: 1.05 },
  { taskId: 'T06', taskLabel: '주문 대기 음료 중 가장 오래된 항목 찾기', baseMs: 5750, difficulty: 1.2 }, // 공통 고난도
]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildRounds() {
  // taskId는 유저당 1회씩만: 총 4라운드, 순서는 랜덤
  return shuffle(TASKS).map((task, idx) => ({ round: idx + 1, task }))
}

function generateUserData(user) {
  const rounds = buildRounds()
  const personalSpeedOffset = randomInt(-450, 700) // 개인별 속도 편차
  const personalMistakeOffset = randomInt(-1, 1)
  const speedupStartRound = randomInt(3, 4) // 3~4문제 이후부터 익숙해짐
  const speedupPerRound = randomInt(110, 170) // 아주 적지만 눈에 보이는 속도 개선

  const quizSequence = rounds.map(({ round, task }) => {
    const base = task.baseMs * task.difficulty + personalSpeedOffset
    const postLearningRounds = Math.max(0, round - speedupStartRound)
    const speedup = postLearningRounds * speedupPerRound
    const noiseRange = postLearningRounds > 0 ? 170 : 240
    const noise = randomInt(-noiseRange, noiseRange)

    // 같은 문제 기준으로 그리드뷰가 조금 더 빠르게 보이되, 차이는 과하지 않게 설정
    const excelSlower = Math.random() < 0.68
    const gap = randomInt(140, 420)

    let excelTime = Math.round(base + noise - speedup)
    let gridTime = Math.round(base + randomInt(-noiseRange, noiseRange) - speedup)

    if (excelSlower) {
      excelTime += gap
      gridTime -= Math.round(gap * randomInt(35, 55) / 100)
    } else {
      gridTime += gap
      excelTime -= Math.round(gap * randomInt(35, 55) / 100)
    }

    excelTime = clamp(excelTime, 2900, 9000)
    gridTime = clamp(gridTime, 2800, 8600)

    // 앞 라운드일수록 오클릭이 많고, 어려운 문제(T03/T04)는 좀 더 많게
    const roundPenalty = round <= 2 ? 2 : round <= 4 ? 1 : 0
    const difficultyPenalty =
      task.taskId === 'T03' || task.taskId === 'T04' || task.taskId === 'T06' ? 1 : 0
    const baseMiss = roundPenalty + difficultyPenalty + personalMistakeOffset

    const excelMisclick = clamp(baseMiss + randomInt(0, 1), 0, 5)
    const gridMisclick = clamp(baseMiss + randomInt(1, 2), 0, 6)

    return {
      round,
      taskId: task.taskId,
      taskLabel: task.taskLabel,
      excelView: {
        responseTimeMs: excelTime,
        misclickCount: excelMisclick,
      },
      gridView: {
        responseTimeMs: gridTime,
        misclickCount: gridMisclick,
      },
    }
  })

  return {
    userId: user.userId,
    participantGroup: user.participantGroup,
    quizSequence,
    fatigue: {
      excelView: randomInt(1, 5),
      gridView: randomInt(1, 5),
    },
  }
}

const result = USERS.map(generateUserData)
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
console.log(`generated: ${OUTPUT_PATH}`)
