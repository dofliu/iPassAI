/**
 * 隨堂快問快答彈出式視窗 (Pop Quiz Modal)
 * 供點擊手機推播通知或點擊「隨堂抽考」時作答，並即時連動個人測驗紀錄
 */
import { useEffect, useState } from "react";
import {
  X, CheckCircle2, XCircle, Sparkles, BookOpen, Volume2, Headphones,
  Bookmark, FileText, ExternalLink, ArrowRight, RotateCcw, AlertTriangle,
  Lightbulb, ShieldCheck
} from "lucide-react";
import { QUESTIONS, type Question, OFFICIAL_RESOURCE_URL } from "@/data/questions";
import { CAMBRIDGE_B2_FIRST } from "@/data/cambridgeB2FirstQuestions";
import { selectQuizQuestion } from "@/services/notificationService";

export interface PopQuizModalProps {
  questionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordAttempt: (attempt: {
    questionId: string;
    correct: boolean;
    selectedAnswer: number;
    date: string;
    mode: "練習";
  }) => void;
  bookmarks: string[];
  onToggleBookmark: (questionId: string) => void;
  notes: Record<string, string>;
  onUpdateNote: (questionId: string, note: string) => void;
}

const CHOICES = ["A", "B", "C", "D"];

export default function PopQuizModal({
  questionId,
  isOpen,
  onClose,
  onRecordAttempt,
  bookmarks,
  onToggleBookmark,
  notes,
  onUpdateNote,
}: PopQuizModalProps) {
  const [currentId, setCurrentId] = useState<string | null>(questionId);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (questionId) {
      setCurrentId(questionId);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }
  }, [questionId]);

  if (!isOpen || !currentId) return null;

  const question = QUESTIONS.find((q) => q.id === currentId) ?? selectQuizQuestion();
  const isBookmarked = bookmarks.includes(question.id);
  const noteContent = notes[question.id] ?? "";
  const isCorrect = selectedAnswer === question.answer;

  const handleSubmit = (answerIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(answerIndex);
    setIsSubmitted(true);
    const correct = answerIndex === question.answer;
    onRecordAttempt({
      questionId: question.id,
      correct,
      selectedAnswer: answerIndex,
      date: new Date().toISOString(),
      mode: "練習",
    });
  };

  const handleNextQuestion = () => {
    const nextQ = selectQuizQuestion();
    setCurrentId(nextQ.id);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  };

  const speakListening = (q: Question, rate = 0.88) => {
    if (!q.audioScript || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(q.audioScript);
    speech.lang = "en-GB";
    speech.rate = rate;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">隨堂快問快答</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {question.level} · {question.subject}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                本題作答結果已自動計入本機個人複盤與每日進度
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
              {question.topic}
            </span>
            <span className={`px-2.5 py-1 rounded-md font-medium border ${
              question.difficulty === "進階"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : question.difficulty === "情境"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              難度：{question.difficulty}
            </span>
            {question.examFamily && (
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                {question.examFamily} {question.component ? `· ${question.component}` : ""}
              </span>
            )}
          </div>

          {/* Cambridge Stimulus or Audio */}
          {question.stimulus && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                <BookOpen size={14} className="text-indigo-600" /> 閱讀材料
              </div>
              {question.stimulus.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {question.audioScript && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Headphones size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-950">Listening 音訊題</div>
                  <div className="text-xs text-indigo-700">支援語音合成播放</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakListening(question, 0.88)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Volume2 size={14} /> 播放
                </button>
                <button
                  type="button"
                  onClick={() => speakListening(question, 0.68)}
                  className="px-2.5 py-1.5 rounded-lg bg-white text-indigo-900 border border-indigo-200 text-xs font-medium hover:bg-indigo-50 transition-colors"
                >
                  慢速 0.68×
                </button>
              </div>
            </div>
          )}

          {/* Question Stem */}
          <div className="text-base font-semibold text-slate-900 leading-relaxed">
            {question.stem}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((option, idx) => {
              const isChosen = selectedAnswer === idx;
              const isAnswer = idx === question.answer;

              let optionStyle = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-800 bg-white";
              if (isSubmitted) {
                if (isAnswer) {
                  optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-semibold";
                } else if (isChosen && !isCorrect) {
                  optionStyle = "border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500";
                } else {
                  optionStyle = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => handleSubmit(idx)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all ${optionStyle}`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 mt-0.5 ${
                      isSubmitted && isAnswer
                        ? "bg-emerald-600 text-white"
                        : isSubmitted && isChosen && !isCorrect
                        ? "bg-rose-600 text-white"
                        : isChosen
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {CHOICES[idx]}
                  </span>
                  <span className="flex-1 leading-relaxed">{option}</span>
                  {isSubmitted && isAnswer && (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isSubmitted && isChosen && !isCorrect && (
                    <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Feedback & Detailed Explanation */}
          {isSubmitted && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  isCorrect
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-rose-50/80 border-rose-200 text-rose-900"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                ) : (
                  <XCircle size={24} className="text-rose-600 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {isCorrect ? "回答正確！觀念掌握良好" : `回答錯誤，正確解答為 (${CHOICES[question.answer]})`}
                  </div>
                  <div className="text-xs opacity-90">
                    {isCorrect
                      ? "本題已記入答對紀錄，並提升主題掌握度。"
                      : "本題已自動歸入錯題複盤庫與弱點排行。"}
                  </div>
                </div>
              </div>

              {/* Core Explanation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <Lightbulb size={14} className="text-amber-500" /> 深度核心解析
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {question.explanation}
                </p>
              </div>

              {/* Mistake Note */}
              {question.trap && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle size={13} className="text-amber-600" /> 易錯盲點提醒
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {question.trap}
                  </p>
                </div>
              )}

              {/* Source Link */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>題目來源：{question.source}</span>
                <a
                  href={question.sourceUrl ?? OFFICIAL_RESOURCE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  官方參考資料 <ExternalLink size={11} />
                </a>
              </div>

              {/* Personal Notes & Bookmark Toolbar */}
              <div className="pt-3 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(question.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isBookmarked
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                    {isBookmarked ? "已收藏此題" : "收藏此題"}
                  </button>
                  <span className="text-xs text-slate-400">
                    <ShieldCheck size={12} className="inline mr-1 text-emerald-600" />
                    個人紀錄僅保存於此裝置
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                    <FileText size={13} /> 個人筆記
                  </label>
                  <textarea
                    rows={2}
                    value={noteContent}
                    onChange={(e) => onUpdateNote(question.id, e.target.value)}
                    placeholder="隨手記錄關鍵記憶點、解題思路或常混淆觀念…"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            關閉視窗
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <RotateCcw size={13} /> 再抽一題
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
