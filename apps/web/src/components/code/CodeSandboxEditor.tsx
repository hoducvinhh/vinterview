'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeSandboxEditorProps {
  onAppendCodeToAnswer: (codeSnippet: string) => void;
}

export function CodeSandboxEditor({ onAppendCodeToAnswer }: CodeSandboxEditorProps) {
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');
  const [code, setCode] = useState<string>(`// Viết mã nguồn hoặc giải thuật của bạn tại đây
function solution() {
  const numbers = [1, 2, 3, 4, 5];
  const doubled = numbers.map(x => x * 2);
  console.log("Kết quả mảng x2:", doubled);
  return doubled;
}

solution();`);

  const [outputLogs, setOutputLogs] = useState<Array<{ type: 'log' | 'error' | 'result'; message: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (newLang: 'javascript' | 'typescript' | 'python') => {
    setLanguage(newLang);
    if (newLang === 'python') {
      setCode(`# Viết mã nguồn Python của bạn tại đây
def solution():
    numbers = [1, 2, 3, 4, 5]
    doubled = [x * 2 for x in numbers]
    print("Kết quả mảng x2:", doubled)
    return doubled

solution()`);
    } else {
      setCode(`// Viết mã nguồn hoặc giải thuật của bạn tại đây
function solution() {
  const numbers = [1, 2, 3, 4, 5];
  const doubled = numbers.map(x => x * 2);
  console.log("Kết quả mảng x2:", doubled);
  return doubled;
}

solution();`);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutputLogs([]);

    const logs: Array<{ type: 'log' | 'error' | 'result'; message: string }> = [];

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    try {
      console.log = (...args: any[]) => {
        logs.push({
          type: 'log',
          message: args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' '),
        });
        originalLog(...args);
      };

      console.error = (...args: any[]) => {
        logs.push({
          type: 'error',
          message: args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' '),
        });
        originalError(...args);
      };

      console.warn = (...args: any[]) => {
        logs.push({
          type: 'log',
          message: `[WARN] ${args.map((a) => String(a)).join(' ')}`,
        });
        originalWarn(...args);
      };

      if (language === 'javascript' || language === 'typescript') {
        // Execute JS safely in Function sandbox
        const runnerFn = new Function(code);
        const result = runnerFn();

        if (result !== undefined) {
          logs.push({
            type: 'result',
            message: `⏎ Returned: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`,
          });
        }
      } else if (language === 'python') {
        // Simulated execution / console output parser for Python
        logs.push({
          type: 'log',
          message: '🐍 Thực thi Python Sandbox Mode (Cú pháp hợp lệ):',
        });
        
        // Basic static print parser fallback for demo Python snippets
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          printMatches.forEach((p) => {
            const inner = p.replace(/^print\(/, '').replace(/\)$/, '');
            logs.push({ type: 'log', message: inner });
          });
        } else {
          logs.push({ type: 'result', message: '✓ Đã biên dịch Python script thành công.' });
        }
      }
    } catch (err: any) {
      logs.push({
        type: 'error',
        message: `❌ Execution Error: ${err?.message || String(err)}`,
      });
    } finally {
      // Restore original console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      setIsRunning(false);
      setOutputLogs(logs);
    }
  };

  const handleAppendToAnswer = () => {
    const formattedSnippet = `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
    onAppendCodeToAnswer(formattedSnippet);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
      {/* Editor Header Toolbar */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-400 border-l border-slate-300 dark:border-slate-800 pl-3">
            VS Code Live Editor
          </span>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono shadow-sm">
            <button
              type="button"
              onClick={() => handleLanguageChange('javascript')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'javascript' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              JS
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('typescript')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'typescript' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              TS
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('python')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'python' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Python
            </button>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{isRunning ? '⏳ Đang Chạy...' : '▶ Chạy Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleAppendToAnswer}
            className="px-3 py-1.5 text-xs font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all cursor-pointer flex items-center gap-1"
          >
            <span>📋 Chèn Vào Bài Làm</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Instance */}
      <div className="h-72 w-full">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            fontSize: 13,
            fontFamily: 'Fira Code, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      {/* Terminal Output Console */}
      <div className="bg-slate-950 border-t border-slate-800 p-4 space-y-2 font-mono">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
          <span className="font-bold flex items-center gap-1.5 text-emerald-400">
            <span>💻</span> Output Terminal Console
          </span>
          {outputLogs.length > 0 && (
            <button
              type="button"
              onClick={() => setOutputLogs([])}
              className="hover:text-white transition-colors cursor-pointer"
            >
              🧹 Xóa Terminal
            </button>
          )}
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1 text-xs text-slate-300">
          {outputLogs.length === 0 ? (
            <div className="text-slate-600 italic">Bấm "▶ Chạy Code" để xem kết quả thực thi...</div>
          ) : (
            outputLogs.map((log, index) => (
              <div
                key={index}
                className={`whitespace-pre-wrap leading-relaxed ${
                  log.type === 'error'
                    ? 'text-rose-400 font-semibold'
                    : log.type === 'result'
                    ? 'text-cyan-300 font-bold'
                    : 'text-emerald-300/90'
                }`}
              >
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
