import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ArrowRight, Shield, Activity, TrendingUp, AlertTriangle, Info, Target } from 'lucide-react';

import { ALL_QUESTIONS } from './data/questions';
import { RISK_PROFILES, OBJECTIVE_LABELS } from './data/profiles';
import { evaluateSuitability } from './lib/scoring';
import { saveSubmission } from './lib/storage';

const PROFILE_ICONS = {
  Conservador: Shield,
  Moderado: Activity,
  'Moderado-Agresivo': TrendingUp,
  Agresivo: TrendingUp,
};

const EQUITY_COLORS = [
  '#1971c2', '#145591', '#0f3d6b', '#3f8fd6', '#6ba9e0',
  '#0ba587', '#0c7c66', '#4bc4a9', '#87d6c2', '#c2ecdf',
];

function buildChartData(profile) {
  let equityIndex = -1;
  return profile.assets.map((asset) => {
    if (asset.isRiskFree) {
      return { ...asset, color: '#eef0f3' };
    }
    equityIndex += 1;
    return { ...asset, color: EQUITY_COLORS[equityIndex % EQUITY_COLORS.length] };
  });
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleStart = () => setCurrentStep(0);

  const handleAnswer = (questionId, letter) => {
    const newAnswers = { ...answers, [questionId]: letter };
    setAnswers(newAnswers);

    if (currentStep < ALL_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setCurrentStep(ALL_QUESTIONS.length);
    setIsAnalyzing(true);
    setTimeout(() => {
      const evaluation = evaluateSuitability(newAnswers);
      saveSubmission({ answers: newAnswers, ...evaluation });
      setResult(evaluation);
      setIsAnalyzing(false);
    }, 2200);
  };

  const profile = result ? RISK_PROFILES[result.finalProfile] : null;
  const ProfileIcon = profile ? PROFILE_ICONS[profile.title] : null;
  const chartData = profile ? buildChartData(profile) : null;
  const objectiveLabel = answers.p4_objetivo ? OBJECTIVE_LABELS[answers.p4_objetivo] : null;

  const restart = () => {
    setCurrentStep(-1);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-primary selection:text-white flex flex-col items-center overflow-x-hidden">

      <nav className="w-full bg-canvas flex items-center justify-between px-8 md:px-16 pt-8 pb-2 z-10 sticky top-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={restart}>
          <span className="text-lg font-bold tracking-tight text-ink">Perfilador de Inversionista</span>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1200px] flex flex-col justify-center items-center px-6 md:px-12 py-6 md:py-12">
        <AnimatePresence mode="wait">

          {currentStep === -1 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl text-center space-y-10"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-ink tracking-tight leading-tight">
                Descubre tu perfil de inversionista.
              </h1>
              <p className="text-lg md:text-xl text-body font-normal leading-relaxed max-w-2xl mx-auto">
                Un cuestionario de suitability de {ALL_QUESTIONS.length} preguntas, basado en el marco
                de Behavioral Finance del curso y en la normativa CMF / MiFID II. No te tomará más de 5 minutos.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleStart}
                  className="bg-primary hover:bg-primary-active text-white text-lg font-semibold h-[64px] px-10 rounded-pill transition-colors flex items-center justify-center mx-auto gap-3 shadow-sm hover:shadow-md"
                >
                  Comenzar evaluación <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep >= 0 && currentStep < ALL_QUESTIONS.length && !isAnalyzing && !result && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-4xl w-full"
            >
              <div className="flex items-center gap-2 mb-4 text-sm text-muted font-medium">
                <span>Pregunta {currentStep + 1} de {ALL_QUESTIONS.length}</span>
                <div className="flex-1 h-1 rounded-full bg-surface-strong overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${((currentStep + 1) / ALL_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>
              <h2 className="text-xl md:text-3xl font-semibold mb-6 md:mb-8 text-ink tracking-tight leading-tight">
                {ALL_QUESTIONS[currentStep].text}
              </h2>
              <div className="space-y-3">
                {ALL_QUESTIONS[currentStep].options.map((option) => (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswer(ALL_QUESTIONS[currentStep].id, option.letter)}
                    className="w-full text-left p-4 md:p-6 rounded-2xl border border-hairline hover:border-primary transition-all group flex items-center justify-between bg-canvas shadow-sm hover:shadow-md"
                  >
                    <span className="text-base md:text-lg text-ink font-normal pr-4">
                      {option.text}
                    </span>
                    <div className="w-6 h-6 rounded-full border border-hairline group-hover:border-primary flex items-center justify-center transition-colors shrink-0">
                      <div className="w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="w-16 h-16 border-4 border-surface-strong border-t-primary rounded-full animate-spin" />
              <h2 className="text-3xl md:text-4xl font-semibold text-ink animate-pulse tracking-tight">
                Analizando tu perfil de riesgo...
              </h2>
              <p className="text-lg text-muted">Aplicando filtros de seguridad y ajustando asignaciones.</p>
            </motion.div>
          )}

          {result && profile && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full"
            >
              <div className="max-w-3xl mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-strong mb-6">
                  <ProfileIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-ink mb-3">
                  Perfil {profile.title}
                </h1>
                <p className="text-lg font-medium text-muted mb-6">{profile.tagline}</p>
                <p className="text-lg md:text-xl text-body max-w-2xl leading-relaxed mb-4">
                  {profile.description}
                </p>
                <p className="text-base text-body max-w-2xl leading-relaxed">
                  <span className="font-semibold text-ink">Tolerancia a caídas: </span>
                  {profile.toleranciaCaidas}
                </p>
                {objectiveLabel && (
                  <p className="text-base text-body max-w-2xl leading-relaxed mt-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary shrink-0" />
                    <span><span className="font-semibold text-ink">Tu objetivo declarado: </span>{objectiveLabel}</span>
                  </p>
                )}
              </div>

              {profile.warning && (
                <div className="max-w-3xl mb-8 flex gap-3 items-start bg-red-50 border border-red-200 rounded-2xl p-5">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 leading-relaxed">{profile.warning}</p>
                </div>
              )}

              {result.consistency.flag && (
                <div className="max-w-3xl mb-8 flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Confiabilidad baja: sus respuestas variaron muy poco entre sí (desviación estándar {result.consistency.sd}).
                    Le sugerimos validar este resultado con una conversación adicional con su asesor
                    (Hartnett, Gerrans y Faff, 2019).
                  </p>
                </div>
              )}

              {result.appliedFilters.length > 0 && (
                <div className="max-w-3xl mb-10 bg-surface-soft border border-hairline rounded-2xl p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
                    Ajustes aplicados por filtros de seguridad
                  </h3>
                  <ul className="space-y-3">
                    {result.appliedFilters.map((f) => (
                      <li key={f.id} className="text-sm text-body leading-relaxed">
                        <span className="font-semibold text-ink">{f.label}:</span> {f.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-10 items-start mb-10">

                <div className="bg-canvas border border-hairline rounded-2xl p-8 md:p-12 flex flex-col items-center shadow-sm">
                  <h3 className="text-3xl md:text-4xl font-bold text-ink w-full mb-2 text-left">Portafolio de referencia</h3>
                  <p className="text-sm text-muted w-full mb-6 text-left">{profile.composicionTexto}</p>
                  <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={130}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value) => `${value.toFixed(1)}%`}
                          contentStyle={{ borderRadius: '12px', border: '1px solid #dee1e6', boxShadow: 'none' }}
                          itemStyle={{ color: '#0a0b0d', fontWeight: 500 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <span className="text-4xl font-semibold text-ink">100%</span>
                      <span className="text-sm text-muted uppercase tracking-wider font-semibold mt-1">Total</span>
                    </div>
                  </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-hairline bg-surface-soft">
                    <h3 className="text-2xl font-bold text-ink">Composición ilustrativa</h3>
                  </div>
                  <div className="p-4 max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {chartData.map((item, idx) => (
                          <tr key={idx} className="border-b border-hairline-soft last:border-0 hover:bg-surface-strong/50 transition-colors">
                            <td className="py-4 px-6 flex items-center gap-4">
                              <div
                                className={`w-3 h-3 rounded-full shrink-0 ${item.isRiskFree ? 'border border-muted' : ''}`}
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-ink">{item.name}</span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <span className="font-mono text-sm font-bold text-ink">
                                {item.value.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              <div className="bg-surface-dark text-white rounded-2xl p-8 md:p-10 mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">
                    Estilo conductual: {result.bit.name}
                  </h3>
                </div>
                <p className="text-white/80 leading-relaxed mb-6 max-w-2xl">
                  {result.bit.description} Esta es una capa complementaria de análisis (Pompian, 2008) —
                  no reemplaza su perfil de riesgo, ayuda a anticipar los sesgos que más podrían influir
                  en sus decisiones futuras.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Sesgos cognitivos típicos</p>
                    <div className="flex flex-wrap gap-2">
                      {result.bit.cognitiveBiases.map((b) => (
                        <span key={b} className="text-xs font-medium bg-white/10 px-3 py-1.5 rounded-pill">{b}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Sesgos emocionales típicos</p>
                    <div className="flex flex-wrap gap-2">
                      {result.bit.emotionalBiases.map((b) => (
                        <span key={b} className="text-xs font-medium bg-white/10 px-3 py-1.5 rounded-pill">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pb-10">
                <button
                  onClick={restart}
                  className="text-body hover:text-ink text-sm font-medium underline underline-offset-4"
                >
                  Volver a responder el cuestionario
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
