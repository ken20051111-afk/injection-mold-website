"use client";

export function DeleteConfirmButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="rounded-sm border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
      onClick={(e) => {
        if (!confirm(`确定删除"${title}"？`)) e.preventDefault();
      }}
    >
      删除
    </button>
  );
}
