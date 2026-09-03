'use client';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({
  isOpen,
  title,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-rose-400">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-bold text-lg">
            !
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Confirm Deletion</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
          Are you sure you want to delete the question{' '}
          <span className="font-semibold text-white">"{title}"</span>?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
