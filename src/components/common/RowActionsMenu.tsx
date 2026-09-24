import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

interface RowActionsMenuProps {
  onEdit: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export default function RowActionsMenu({ onEdit, onDelete, onView }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  return <div className="relative inline-block text-left">
    <button type="button" aria-label="Row actions" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>
    {open && <><button type="button" aria-label="Close actions menu" className="fixed inset-0 z-20 cursor-default" onClick={() => setOpen(false)} /><div className="absolute right-0 z-30 mt-1 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
      {onView && <button type="button" onClick={() => { onView(); setOpen(false); }} className="w-full rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">View profile</button>}
      <button type="button" onClick={() => { onEdit(); setOpen(false); }} className="w-full rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">Edit</button>
      {onDelete && <button type="button" onClick={() => { onDelete(); setOpen(false); }} className="w-full rounded-md px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50">Delete</button>}
    </div></>}
  </div>;
}
