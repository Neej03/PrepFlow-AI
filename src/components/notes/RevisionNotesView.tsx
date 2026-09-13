'use client';

import React, { useState, useRef } from 'react';
import { 
  Copy, 
  Download, 
  Share2, 
  RefreshCw, 
  Check, 
  Play, 
  Printer,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ProcessedMaterial } from '@/types';

interface RevisionNotesViewProps {
  material: ProcessedMaterial;
  onStartQuiz: () => void;
  onRegenerate: () => void;
  onOpenShare: () => void;
}

export const RevisionNotesView: React.FC<RevisionNotesViewProps> = ({
  material,
  onStartQuiz,
  onRegenerate,
  onOpenShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  const { notes, personalization } = material;

  // Title formatting: "Study Notes: Title"
  const rawTitle = notes.title.replace(/^Revision Notes:\s*/i, '').replace(/^Mastery Notes:\s*/i, '').replace(/^Study Notes:\s*/i, '');
  const documentTitle = `Study Notes: ${rawTitle}`;

  // Helper function to split "Term: Description" and render term in bold
  const renderFormattedBullet = (text: string) => {
    const colonIndex = text.indexOf(':');
    if (colonIndex > 0 && colonIndex < 40) {
      const term = text.slice(0, colonIndex);
      const desc = text.slice(colonIndex + 1);
      return (
        <span>
          <strong className="font-bold text-slate-900 dark:text-white">{term.trim()}:</strong>
          {desc}
        </span>
      );
    }

    // Check for inline math patterns like n = 10 or formulas
    return <span>{text}</span>;
  };

  const handleCopyNotes = () => {
    let text = `${documentTitle.toUpperCase()}\n`;
    text += `Subject: ${personalization.subject} | Level: ${personalization.studyLevel}\n`;
    text += `------------------------------------------------------------------------\n\n`;

    text += `1. Introduction\n${notes.overview}\n\n`;

    if (notes.definitions && notes.definitions.length > 0) {
      text += `2. Definitions\n`;
      notes.definitions.forEach((d) => (text += `• ${d.term}: ${d.definition}\n`));
      text += `\n`;
    }

    if (notes.keyConcepts && notes.keyConcepts.length > 0) {
      text += `3. Key Concepts\n`;
      notes.keyConcepts.forEach((kc) => {
        text += `• ${kc.name}: ${kc.description}\n`;
        if (kc.simpleExplanation) text += `  Equation / Rule: ${kc.simpleExplanation}\n`;
      });
      text += `\n`;
    }

    if (notes.bulletPoints && notes.bulletPoints.length > 0) {
      text += `4. Categories\n`;
      notes.bulletPoints.forEach((bp) => {
        text += `${bp.topic}\n`;
        bp.points.forEach((pt) => (text += `• ${pt}\n`));
        text += `\n`;
      });
    }

    if (notes.examPoints && notes.examPoints.length > 0) {
      text += `5. Important Theories\n`;
      notes.examPoints.forEach((ep) => {
        text += `${ep.point}\n`;
        if (ep.whyItMatters) text += `${ep.whyItMatters}\n\n`;
      });
    }

    if (notes.examples && notes.examples.length > 0) {
      text += `6. Examples\n`;
      notes.examples.forEach((ex, idx) => {
        text += `Example ${idx + 1}: ${ex.scenario}\n${ex.explanation}\n`;
        if (ex.solutionSteps) ex.solutionSteps.forEach((s) => (text += `• ${s}\n`));
        text += `\n`;
      });
    }

    const apps = notes.practicalApplications && notes.practicalApplications.length > 0 ? notes.practicalApplications : notes.rememberThis;
    if (apps && apps.length > 0) {
      text += `7. Practical Applications\n`;
      apps.forEach((item) => {
        const textStr = typeof item === 'string' ? item : `${item.title}: ${item.description}`;
        text += `• ${textStr}\n`;
      });
      text += `\n`;
    }

    text += `8. Further Exploration\n`;
    if (notes.furtherExploration && notes.furtherExploration.length > 0) {
      notes.furtherExploration.forEach((res) => (text += `• ${res}\n`));
    } else {
      text += `• "A First Course in Probability" by Sheldon Ross\n`;
      text += `• "Probability and Statistics" by Morris H. DeGroot and Mark J. Schervish\n`;
      text += `• Khan Academy's Probability and Statistics Course\n`;
    }
    text += `\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    let text = `${documentTitle.toUpperCase()}\n`;
    text += `Subject: ${personalization.subject} | Level: ${personalization.studyLevel}\n`;
    text += `========================================================================\n\n`;

    text += `1. Introduction\n---------------\n${notes.overview}\n\n`;

    if (notes.definitions && notes.definitions.length > 0) {
      text += `2. Definitions\n--------------\n`;
      notes.definitions.forEach((d) => (text += `• ${d.term}: ${d.definition}\n`));
      text += `\n`;
    }

    if (notes.keyConcepts && notes.keyConcepts.length > 0) {
      text += `3. Key Concepts\n---------------\n`;
      notes.keyConcepts.forEach((kc) => {
        text += `• ${kc.name}: ${kc.description}\n`;
        if (kc.simpleExplanation) text += `  Equation / Rule: ${kc.simpleExplanation}\n`;
      });
      text += `\n`;
    }

    if (notes.bulletPoints && notes.bulletPoints.length > 0) {
      text += `4. Categories\n-------------\n`;
      notes.bulletPoints.forEach((bp) => {
        text += `${bp.topic}\n`;
        bp.points.forEach((pt) => (text += `• ${pt}\n`));
        text += `\n`;
      });
    }

    if (notes.examPoints && notes.examPoints.length > 0) {
      text += `5. Important Theories\n---------------------\n`;
      notes.examPoints.forEach((ep) => {
        text += `${ep.point}\n`;
        if (ep.whyItMatters) text += `${ep.whyItMatters}\n\n`;
      });
    }

    if (notes.examples && notes.examples.length > 0) {
      text += `6. Examples\n-----------\n`;
      notes.examples.forEach((ex, idx) => {
        text += `Example ${idx + 1}: ${ex.scenario}\n${ex.explanation}\n`;
        if (ex.solutionSteps) ex.solutionSteps.forEach((s) => (text += `• ${s}\n`));
        text += `\n`;
      });
    }

    const apps = notes.practicalApplications && notes.practicalApplications.length > 0 ? notes.practicalApplications : notes.rememberThis;
    if (apps && apps.length > 0) {
      text += `7. Practical Applications\n-------------------------\n`;
      apps.forEach((item) => {
        const textStr = typeof item === 'string' ? item : `${item.title}: ${item.description}`;
        text += `• ${textStr}\n`;
      });
      text += `\n`;
    }

    text += `8. Further Exploration\n----------------------\n`;
    if (notes.furtherExploration && notes.furtherExploration.length > 0) {
      notes.furtherExploration.forEach((res) => (text += `• ${res}\n`));
    } else {
      text += `• "A First Course in Probability" by Sheldon Ross\n`;
      text += `• "Probability and Statistics" by Morris H. DeGroot and Mark J. Schervish\n`;
      text += `• Khan Academy's Probability and Statistics Course\n`;
    }
    text += `\n`;

    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${rawTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_complete_all_pages_notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      if (notesRef.current) {
        const element = notesRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          windowWidth: element.scrollWidth || 1000,
          windowHeight: element.scrollHeight || 2000,
          height: element.scrollHeight,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scaledImgHeight = (canvasHeight * pdfWidth) / canvasWidth;

        let heightLeft = scaledImgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`${rawTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_complete_all_pages.pdf`);
      }
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold">
            {personalization.subject}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
            {personalization.studyLevel}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyNotes}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>

          <button
            onClick={onOpenShare}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>

          <button
            onClick={onRegenerate}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700"
            title="Regenerate notes"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Regenerate</span>
          </button>

          {/* Primary Quiz CTA */}
          <button
            onClick={onStartQuiz}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Practice Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Single Document Canvas - Exact User Format Match */}
      <div 
        ref={notesRef} 
        id="notes-canvas"
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-14 shadow-xl space-y-9 text-slate-800 dark:text-slate-100 font-sans"
      >
        {/* Title */}
        <div className="space-y-1 pb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {documentTitle}
          </h1>
        </div>

        {/* 1. Introduction */}
        {notes.overview && (
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Introduction
            </h2>
            <p className="text-base sm:text-[17px] leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
              {notes.overview}
            </p>
          </section>
        )}

        {/* 2. Definitions */}
        {notes.definitions && notes.definitions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Definitions
            </h2>
            <ul className="space-y-2.5">
              {notes.definitions.map((def, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                  <span>
                    <strong className="font-bold text-slate-900 dark:text-white">{def.term}:</strong>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{def.definition}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 3. Key Concepts */}
        {notes.keyConcepts && notes.keyConcepts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Key Concepts
            </h2>

            {/* Sub-groups or Concept Items */}
            <div className="space-y-5">
              {notes.keyConcepts.map((kc, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    {kc.name}
                  </h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                      <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                      <span>
                        {renderFormattedBullet(`${kc.name}: ${kc.description}`)}
                      </span>
                    </li>
                  </ul>

                  {/* Centered Boxed Math / Equation if present or simple explanation */}
                  {kc.simpleExplanation && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 sm:p-5 rounded-xl text-center text-base sm:text-lg font-serif text-slate-800 dark:text-slate-100 my-3 shadow-xs">
                      {kc.simpleExplanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Display Formulas under Key Concepts if available */}
            {notes.formulas && notes.formulas.length > 0 && (
              <div className="space-y-4 pt-2">
                {notes.formulas.map((f, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                      {f.name}
                    </h3>
                    <p className="text-base sm:text-[17px] text-slate-700 dark:text-slate-300">
                      {f.explanation}
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 sm:p-5 rounded-xl text-center text-base sm:text-lg font-serif text-slate-800 dark:text-slate-100 my-3 shadow-xs overflow-x-auto">
                      {f.formula}
                    </div>
                    {f.variables && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-mono">
                        provided {f.variables}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 4. Categories */}
        {notes.bulletPoints && notes.bulletPoints.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Categories
            </h2>

            <div className="space-y-4">
              {notes.bulletPoints.map((bp, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    {bp.topic}
                  </h3>
                  <ul className="space-y-2">
                    {bp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                        <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                        <span>{renderFormattedBullet(pt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Important Theories */}
        {notes.examPoints && notes.examPoints.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Important Theories
            </h2>

            <div className="space-y-4">
              {notes.examPoints.map((ep, idx) => {
                const parts = ep.point.split(':');
                const title = parts.length > 1 ? parts[0] : `Theory #${idx + 1}`;
                const body = parts.length > 1 ? parts.slice(1).join(':') : ep.point;

                return (
                  <div key={idx} className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                      {title.trim()}
                    </h3>
                    <p className="text-base sm:text-[17px] leading-relaxed text-slate-700 dark:text-slate-300">
                      {body.trim()}
                    </p>
                    {ep.whyItMatters && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 pt-0.5">
                        {ep.whyItMatters}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. Examples */}
        {notes.examples && notes.examples.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Examples
            </h2>

            <div className="space-y-5">
              {notes.examples.map((ex, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    Example {idx + 1}: {ex.scenario}
                  </h3>
                  <p className="text-base sm:text-[17px] leading-relaxed text-slate-700 dark:text-slate-300">
                    {ex.explanation}
                  </p>

                  {ex.solutionSteps && ex.solutionSteps.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {ex.solutionSteps.map((step, sIdx) => {
                        const isMathBlock = step.includes('=') && (step.includes('(') || step.includes('!') || step.includes('^'));
                        if (isMathBlock) {
                          return (
                            <div key={sIdx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 sm:p-5 rounded-xl text-center text-base sm:text-lg font-serif text-slate-800 dark:text-slate-100 my-3 shadow-xs overflow-x-auto">
                              {step}
                            </div>
                          );
                        }
                        return (
                          <div key={sIdx} className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                            <span>{renderFormattedBullet(step)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Practical Applications */}
        {((notes.practicalApplications && notes.practicalApplications.length > 0) || (notes.rememberThis && notes.rememberThis.length > 0)) && (
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Practical Applications
            </h2>
            <ul className="space-y-2.5">
              {(notes.practicalApplications && notes.practicalApplications.length > 0
                ? notes.practicalApplications
                : notes.rememberThis
              ).map((item, idx) => {
                const textStr = typeof item === 'string' ? item : `${item.title}: ${item.description}`;
                return (
                  <li key={idx} className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                    <span>{renderFormattedBullet(textStr)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* 8. Further Exploration */}
        {notes.furtherExploration && notes.furtherExploration.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Further Exploration
            </h2>
            <ul className="space-y-2.5">
              {notes.furtherExploration.map((res, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                  <span className="text-slate-700 dark:text-slate-300">{res}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Further Exploration
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                <span className="text-slate-700 dark:text-slate-300">“A First Course in Probability” by Sheldon Ross</span>
              </li>
              <li className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                <span className="text-slate-700 dark:text-slate-300">“Probability and Statistics” by Morris H. DeGroot and Mark J. Schervish</span>
              </li>
              <li className="flex items-start space-x-2.5 text-base sm:text-[17px] leading-relaxed">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xl leading-none mt-1 shrink-0">•</span>
                <span className="text-slate-700 dark:text-slate-300">Khan Academy’s Probability and Statistics Course</span>
              </li>
            </ul>
          </section>
        )}
      </div>

      {/* Bottom Practice Quiz CTA Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-950 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg border border-indigo-500/20">
        <div>
          <h3 className="text-base font-bold text-white">Ready to test your comprehension?</h3>
          <p className="text-xs text-slate-300">Take the personalized 5-question AI practice quiz to test your exam readiness.</p>
        </div>
        <button
          onClick={onStartQuiz}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Practice Quiz Now</span>
        </button>
      </div>
    </div>
  );
};
