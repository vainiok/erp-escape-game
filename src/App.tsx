import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { getResult, getRiskCount, questions } from './game'

function App() {
  const [phase, setPhase] = useState<'welcome' | 'questions' | 'result'>('welcome')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const focusTargetRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    focusTargetRef.current?.focus()
  }, [phase, currentQuestionIndex])

  const currentQuestion = questions[currentQuestionIndex]
  const progressValue =
    phase === 'welcome' ? 0 : phase === 'result' ? questions.length : currentQuestionIndex + 1
  const progressLabel =
    phase === 'welcome'
      ? 'Peli ei ole vielä alkanut.'
      : phase === 'result'
        ? 'Kaikki 8 kysymystä on vastattu.'
        : `Kysymys ${currentQuestionIndex + 1} / ${questions.length}.`

  const result = useMemo(() => (phase === 'result' ? getResult(answers) : null), [answers, phase])

  function startGame() {
    setAnswers([])
    setSelectedAnswer(null)
    setCurrentQuestionIndex(0)
    setPhase('questions')
  }

  function handleContinue() {
    if (selectedAnswer === null) {
      return
    }

    const nextAnswers = [...answers, selectedAnswer]
    setAnswers(nextAnswers)
    setSelectedAnswer(null)

    if (currentQuestionIndex === questions.length - 1) {
      setPhase('result')
      return
    }

    setCurrentQuestionIndex((index) => index + 1)
  }

  function restartGame() {
    setPhase('welcome')
    setCurrentQuestionIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="game-title">
        <div className="hero-copy">
          <span className="eyebrow">Innofactor demo</span>
          <h1 id="game-title">How to escape from the old ERP?</h1>
          <p className="hero-text">
            Arvioi kahdeksan kysymyksen avulla, onko nykyinen ERP-ratkaisunne edelleen oikea
            valinta vai onko uudistamisen aika.
          </p>
        </div>
        <div className="hero-badge" aria-hidden="true">
          <span>8</span>
          <small>kysymystä</small>
        </div>
      </section>

      <section className="game-panel" aria-labelledby="status-heading">
        <div className="status-row">
          <div>
            <h2 id="status-heading">Pelin eteneminen</h2>
            <p className="status-copy">{progressLabel}</p>
          </div>
          <div className="progress-meta" aria-live="polite">
            <span>{progressValue}/{questions.length}</span>
            <span className="sr-only">{progressLabel}</span>
          </div>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={progressValue}
          aria-label="Pelin eteneminen"
        >
          <div
            className="progress-fill"
            style={{ width: `${(progressValue / questions.length) * 100}%` }}
          />
        </div>

        {phase === 'welcome' ? (
          <section className="card welcome-card" aria-labelledby="welcome-heading">
            <h2 ref={focusTargetRef} tabIndex={-1} id="welcome-heading">
              Tervetuloa ERP-pakopeliin
            </h2>
            <p>
              Vastaa kysymyksiin yksi kerrallaan. Näet lopuksi värikoodatun arvion siitä,
              kuinka kiireellinen ERP-uudistus voi olla.
            </p>
            <ul className="feature-list">
              <li>• Vastaukset etenevät hallitusti kysymys kerrallaan</li>
              <li>• Näppäimistötuki, näkyvät fokustilat ja ruudunlukijaystävällinen status</li>
              <li>• Tuloksena vihreä, keltainen tai punainen suositus</li>
            </ul>
            <button type="button" className="primary-button" onClick={startGame}>
              Aloita peli
            </button>
          </section>
        ) : null}

        {phase === 'questions' ? (
          <section className="card question-card" aria-labelledby="question-heading">
            <div className="question-intro">
              <p className="question-count">Kysymys {currentQuestionIndex + 1}</p>
              <h2 ref={focusTargetRef} tabIndex={-1} id="question-heading">
                {currentQuestion.text}
              </h2>
              {currentQuestion.helperText ? (
                <p className="helper-text">{currentQuestion.helperText}</p>
              ) : null}
            </div>

            <fieldset className="answer-group">
              <legend className="sr-only">Valitse vastaus kysymykseen</legend>
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex

                return (
                  <label
                    key={option.label}
                    className={`answer-button${isSelected ? ' selected' : ''}`}
                    htmlFor={`question-${currentQuestion.id}-option-${optionIndex}`}
                  >
                    <input
                      id={`question-${currentQuestion.id}-option-${optionIndex}`}
                      className="answer-input"
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => setSelectedAnswer(optionIndex)}
                    />
                    <span className="answer-label">{option.label}</span>
                  </label>
                )
              })}
            </fieldset>

            <div className="card-footer">
              <p className="selection-status" aria-live="polite">
                {selectedAnswer === null
                  ? 'Valitse vastaus jatkaaksesi.'
                  : `Valittu: ${currentQuestion.options[selectedAnswer].label}`}
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={handleContinue}
                disabled={selectedAnswer === null}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Näytä tulos' : 'Seuraava kysymys'}
              </button>
            </div>
          </section>
        ) : null}

        {phase === 'result' && result ? (
          <section className={`card result-card ${result.tone}`} aria-labelledby="result-heading">
            <p className="result-kicker">Valmis</p>
            <h2 ref={focusTargetRef} tabIndex={-1} id="result-heading">
              {result.title}
            </h2>
            <p className="result-body">{result.body}</p>
            <div className="result-summary" role="status" aria-live="polite">
              <span>Riskivastauksia yhteensä: {getRiskCount(answers)}</span>
              <span>Ota yhteyttä Innofactoriin</span>
            </div>
            <button type="button" className="primary-button" onClick={restartGame}>
              Aloita alusta
            </button>
          </section>
        ) : null}
      </section>
    </main>
  )
}

export default App
