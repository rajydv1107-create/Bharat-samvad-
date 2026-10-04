import React, { useState } from 'react';
import { Vote, Plus, Trash2, X, CheckSquare } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';

interface Props {
  t: TranslationDictionary;
  onSubmit: (question: string, options: string[], allowMultiple: boolean) => void;
  onClose: () => void;
}

export const CreatePollModal: React.FC<Props> = ({ t, onSubmit, onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([
    'Yes, strongly in favor',
    'No, need more details',
    'Discuss in AGM',
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (text: string, index: number) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;
    onSubmit(question.trim(), validOptions, allowMultiple);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111b21] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#202c33] border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Vote className="w-5 h-5 text-[#00a884]" />
            <span>{t.createPoll}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Poll Question</label>
            <input
              type="text"
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. Should we approve 24x7 security barrier upgrade?"
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex justify-between items-center">
              <span>Options</span>
              <span className="text-[11px] text-slate-500">{options.length}/8 max</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={option}
                    onChange={e => handleOptionChange(e.target.value, idx)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 bg-[#202c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884]"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 8 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-[#00a884] hover:text-[#25d366] font-medium flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option</span>
              </button>
            )}
          </div>

          {/* Settings */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span>Allow multiple choices</span>
            </span>
            <input
              type="checkbox"
              checked={allowMultiple}
              onChange={e => setAllowMultiple(e.target.checked)}
              className="accent-[#00a884] w-4 h-4 rounded"
            />
          </div>

          {/* Action */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white font-medium rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <Vote className="w-4 h-4" />
            <span>Create Encrypted Community Poll</span>
          </button>
        </form>
      </div>
    </div>
  );
};
