export type AnswerOption = {
  label: string
  isRisk: boolean
}

export type Question = {
  id: number
  text: string
  options: AnswerOption[]
  helperText?: string
}

export type GameState = 'welcome' | 'questions' | 'result'

export type ResultTone = 'green' | 'yellow' | 'red'

export type ResultContent = {
  tone: ResultTone
  title: string
  body: string
}

export const questions: Question[] = [
  {
    id: 1,
    text: 'Kokoaako joku yrityksessänne raportteja Exceliin?',
    options: [
      { label: 'Ei', isRisk: false },
      { label: 'Kyllä', isRisk: true },
    ],
  },
  {
    id: 2,
    text: 'Etsivätkö ihmiset tietoa sähköposteista tai kansioista?',
    options: [
      { label: 'Ei', isRisk: false },
      { label: 'Kyllä', isRisk: true },
    ],
  },
  {
    id: 3,
    text: 'Onko ERP:issänne point-to-point integraatioita',
    options: [
      { label: 'Ei', isRisk: false },
      { label: 'Kyllä', isRisk: true },
    ],
  },
  {
    id: 4,
    text: 'Onko ERP ratkaisuanne räätälöity merkittävästi??',
    options: [
      { label: 'Ei', isRisk: false },
      { label: 'Kyllä', isRisk: true },
    ],
  },
  {
    id: 5,
    text: 'Onko teillä käytössä L7 tai muu vanheneva ERP?',
    options: [
      { label: 'Ei', isRisk: false },
      { label: 'Kyllä', isRisk: true },
    ],
    helperText: 'Kyllä-vastaus ohjaa aina punaiseen tulokseen.',
  },
  {
    id: 6,
    text: 'Tarjoaako ERP:nne tekoälykyvykkyyksiä',
    options: [
      { label: 'Ei', isRisk: false },
      { label: 'Kyllä', isRisk: true },
    ],
  },
  {
    id: 7,
    text: 'Montako käyttäjää järjestelmällä on?',
    options: [
      { label: '1–99', isRisk: false },
      { label: 'Yli 100', isRisk: true },
    ],
    helperText: 'Läpinäkyvyyden vuoksi: “Yli 100” käsitellään riskivastauksena.',
  },
  {
    id: 8,
    text: 'Onko viimeisimmästä ERP uudistuksesta vähintään 5 vuotta?',
    options: [
      { label: 'Ei', isRisk: false },
      { label: 'Kyllä', isRisk: true },
    ],
  },
]

export const resultContent: Record<ResultTone, ResultContent> = {
  green: {
    tone: 'green',
    title: 'Vihreä tulos',
    body: 'Kaikki näyttää hyvältä – ERP:tä ei tarvitse uusia. Jos teillä on muita tarpeita, esimerkiksi tekoälyn, CRM:n tai projektinhallinnan suhteen, ole yhteydessä Innofactoriin.',
  },
  yellow: {
    tone: 'yellow',
    title: 'Keltainen tulos',
    body: 'ERP:n vaihtoa kannattaa harkita 1–3 vuoden sisällä. Tarjoamme mielellämme maksuttoman puolen päivän konsultoinnin.',
  },
  red: {
    tone: 'red',
    title: 'Punainen tulos',
    body: 'ERP:n vaihtaminen voi olla ajankohtaista pian. Tarjoamme mielellämme maksuttoman puolen päivän konsultoinnin.',
  },
}

export function getRiskCount(answerIndexes: number[]): number {
  return answerIndexes.reduce((total, answerIndex, questionIndex) => {
    const selectedOption = questions[questionIndex]?.options[answerIndex]
    return total + Number(selectedOption?.isRisk ?? false)
  }, 0)
}

export function getResult(answerIndexes: number[]): ResultContent {
  const legacyQuestionIndex = 4
  const legacyAnswer = answerIndexes[legacyQuestionIndex]
  const legacyIsRisk = questions[legacyQuestionIndex]?.options[legacyAnswer]?.isRisk ?? false
  const riskCount = getRiskCount(answerIndexes)

  if (legacyIsRisk || riskCount >= 4) {
    return resultContent.red
  }

  if (riskCount === 3) {
    return resultContent.yellow
  }

  return resultContent.green
}
