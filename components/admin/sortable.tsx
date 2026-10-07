"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";

type HandleProps = ReturnType<typeof useSortable>["listeners"] & ReturnType<typeof useSortable>["attributes"];
const HandleContext = createContext<HandleProps | null>(null);

export function useSortSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
}

/**
 * Drag-and-drop list. Items need a stable `id`. Drag by the handle, or focus the
 * handle and use Space + arrow keys.
 */
export function SortableList<T extends { id: string | number }>({
  items,
  onChange,
  children,
  direction = "vertical",
  className,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  children: (item: T, index: number) => React.ReactNode;
  direction?: "vertical" | "horizontal";
  className?: string;
}) {
  const sensors = useSortSensors();

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;
    onChange(arrayMove(items, from, to));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={direction === "vertical" ? verticalListSortingStrategy : horizontalListSortingStrategy}
      >
        <div className={className}>{items.map((item, index) => children(item, index))}</div>
      </SortableContext>
    </DndContext>
  );
}

export function SortableItem({
  id,
  children,
  className,
}: {
  id: string | number;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <HandleContext.Provider value={{ ...attributes, ...listeners } as HandleProps}>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Translate.toString(transform), transition }}
        className={cn(className, isDragging && "relative z-20 opacity-90 shadow-xl")}
      >
        {children}
      </div>
    </HandleContext.Provider>
  );
}

export function DragHandle({ label = "Drag to reorder", className }: { label?: string; className?: string }) {
  const props = useContext(HandleContext);
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-frantoio/40 hover:bg-frantoio/6 hover:text-frantoio active:cursor-grabbing",
        className,
      )}
    >
      <GripVertical className="size-4" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
