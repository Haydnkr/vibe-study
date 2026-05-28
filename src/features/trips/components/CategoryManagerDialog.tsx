'use client';

import { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import { useTravelMapStore } from '@/features/trips/store';
import type { Category } from '@/features/trips/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_NEW_COLOR = '#3b82f6';

export default function CategoryManagerDialog({ open, onClose }: Props) {
  const categories = useTravelMapStore((s) => s.categories);
  const createCategory = useTravelMapStore((s) => s.createCategory);
  const updateCategory = useTravelMapStore((s) => s.updateCategory);
  const deleteCategory = useTravelMapStore((s) => s.deleteCategory);

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(DEFAULT_NEW_COLOR);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    createCategory({ name: trimmed, color: newColor });
    setNewName('');
    setNewColor(DEFAULT_NEW_COLOR);
  }

  return (
    <Dialog open={open} onClose={onClose} label="카테고리 관리" maxWidth="max-w-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-ink">카테고리 관리</h2>
        <p className="mt-1 text-xs text-muted">
          폴리라인·사이드바 카드 색이 카테고리 색을 따릅니다. 사용자가 자유롭게 추가·수정·삭제할 수 있습니다.
        </p>

        <form onSubmit={handleAdd} className="mt-4 flex items-end gap-2">
          <label className="flex-1 text-sm text-body">
            이름
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예: 휴가"
              className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
            />
          </label>
          <label className="text-sm text-body">
            색
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="mt-1 h-10 w-14 cursor-pointer rounded-lg border border-hairline bg-canvas"
            />
          </label>
          <button
            type="submit"
            disabled={!newName.trim()}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white disabled:opacity-40"
          >
            추가
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            카테고리 목록
          </h3>
          {categories.length === 0 ? (
            <p className="mt-2 text-sm text-muted">아직 카테고리가 없습니다.</p>
          ) : (
            <ul className="mt-2 divide-y divide-hairline">
              {categories.map((c) => (
                <CategoryRow
                  key={c.id}
                  category={c}
                  onUpdate={(patch) => updateCategory(c.id, patch)}
                  onDelete={() => deleteCategory(c.id)}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] text-ink"
          >
            닫기
          </button>
        </div>
      </div>
    </Dialog>
  );
}

interface RowProps {
  category: Category;
  onUpdate: (patch: Partial<Omit<Category, 'id'>>) => void;
  onDelete: () => void;
}

function CategoryRow({ category, onUpdate, onDelete }: RowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);

  function commit() {
    const trimmed = name.trim();
    if (trimmed && (trimmed !== category.name || color !== category.color)) {
      onUpdate({ name: trimmed, color });
    } else {
      setName(category.name);
      setColor(category.color);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="flex items-center gap-2 py-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border border-hairline"
        />
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              setName(category.name);
              setColor(category.color);
              setEditing(false);
            }
          }}
          className="flex-1 rounded-md border border-hairline bg-canvas px-2 py-1 text-sm text-ink outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={commit}
          className="rounded-md bg-ink px-3 py-1 text-xs font-medium text-white"
        >
          저장
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 py-2">
      <span
        className="inline-block h-4 w-4 shrink-0 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span className="flex-1 text-sm text-ink">{category.name}</span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-md px-2 py-1 text-xs text-muted hover:bg-surface-soft hover:text-ink"
      >
        편집
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-surface-soft"
      >
        삭제
      </button>
    </li>
  );
}
