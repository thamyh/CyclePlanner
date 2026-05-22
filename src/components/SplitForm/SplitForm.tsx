"use client";
import React, { useState, useEffect } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import Card from "@/components/UI/Card";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FormItem {
  id: string;
  name: string;
  color: string;
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#14b8a6",
];

// Sortable Item Component
function SortableItem({
  item,
  index,
  handleChangeItem,
  handleRemoveItem
}: {
  item: FormItem,
  index: number,
  handleChangeItem: (id: string, field: "name" | "color", value: string) => void,
  handleRemoveItem: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col bg-gray-800/40 p-2.5 rounded-xl border transition-all ${isDragging ? "border-blue-500 shadow-xl opacity-90 z-50 relative" : "border-gray-700/50 hover:border-gray-500"
        }`}
    >
      {/* Top Row: Handle, Index, Delete */}
      <div className="flex items-center justify-between w-full mb-2.5">
        <div className="flex items-center">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-white mr-1.5 flex-shrink-0 touch-none outline-none"
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>

          {/* Index number */}
          <div className="text-gray-400 font-bold text-xs w-5 h-5 flex items-center justify-center bg-gray-900/60 rounded">
            {index + 1}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => handleRemoveItem(item.id)}
          className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-all"
          title="Remove Day"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Bottom Row: Name and Color */}
      <div className="flex items-center w-full gap-2">
        {/* Color Picker */}
        <input
          type="color"
          value={item.color}
          onChange={(e) => handleChangeItem(item.id, "color", e.target.value)}
          className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent overflow-hidden flex-shrink-0"
        />

        {/* Input */}
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleChangeItem(item.id, "name", e.target.value)}
          className="flex-1 w-full px-2 py-1.5 bg-gray-900/30 border border-transparent hover:border-gray-600 focus:border-blue-500 text-white focus:outline-none rounded font-medium text-sm transition-colors min-w-0"
          placeholder="Day name"
        />
      </div>
    </div>
  );
}

export default function SplitForm() {
  const { splits, settings, addSplit, updateSplit, deleteSplit, setSettings } = useSettings();

  const [selectedSplitId, setSelectedSplitId] = useState<string>("new");

  const [splitName, setSplitName] = useState("My Training Split");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [items, setItems] = useState<FormItem[]>([
    { id: uuidv4(), name: "Push", color: "#ef4444" },
    { id: uuidv4(), name: "Pull", color: "#3b82f6" },
    { id: uuidv4(), name: "Legs", color: "#22c55e" },
    { id: uuidv4(), name: "Rest", color: "#6b7280" },
  ]);

  // Set up sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (settings && splits.length > 0) {
      loadSplitData(settings.splitId);
    } else if (splits.length > 0) {
      loadSplitData(splits[0].id);
    }
  }, []);

  const loadSplitData = (id: string) => {
    if (id === "new") {
      setSelectedSplitId("new");
      setSplitName("New Cycle");
      setItems([{ id: uuidv4(), name: "Day 1", color: "#3b82f6" }]);
      return;
    }

    const targetSplit = splits.find(s => s.id === id);
    if (targetSplit) {
      setSelectedSplitId(id);
      setSplitName(targetSplit.name);
      if (settings?.splitId === id) {
        setStartDate(settings.startDate);
      }

      const loadedItems = targetSplit.items.map((itemStr) => ({
        id: uuidv4(),
        name: itemStr,
        color: targetSplit.colors?.[itemStr] || "#3b82f6"
      }));
      setItems(loadedItems);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    loadSplitData(e.target.value);
  };

  const handleDeleteSplit = () => {
    if (selectedSplitId === "new") return;
    if (window.confirm(`Are you sure you want to delete "${splitName}"?`)) {
      deleteSplit(selectedSplitId);
      loadSplitData("new");
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), name: "New Day", color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)] },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleChangeItem = (id: string, field: "name" | "color", value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Handle Drag End event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    if (items.some((i) => !i.name.trim())) {
      alert("All days must have a name.");
      return;
    }

    const itemNames = items.map((i) => i.name.trim());
    const colorsMap: Record<string, string> = {};
    items.forEach((i) => {
      colorsMap[i.name.trim()] = i.color;
    });

    let targetSplitId = selectedSplitId;

    if (selectedSplitId === "new") {
      const newId = uuidv4();
      addSplit({
        id: newId,
        name: splitName,
        items: itemNames,
        colors: colorsMap
      });
      targetSplitId = newId;
      setSelectedSplitId(newId);
    } else {
      const existing = splits.find((s) => s.id === selectedSplitId);
      if (existing) {
        updateSplit({
          ...existing,
          name: splitName,
          items: itemNames,
          colors: colorsMap,
        });
      }
    }

    setSettings({
      splitId: targetSplitId,
      startDate: startDate,
      startItem: itemNames[0] || "Day 1",
    });

    alert("Schedule saved successfully!");
  };

  return (
    <Card className="max-w-2xl mx-auto space-y-8 p-6 md:p-8">
      {/* Saved Cycles Dropdown */}
      <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700/80 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-400 mb-1">Load Saved Cycle</label>
            <select
              value={selectedSplitId}
              onChange={handleDropdownChange}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="new">-- Create New Cycle --</option>
              {splits.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          {selectedSplitId !== "new" && (
            <button
              onClick={handleDeleteSplit}
              className="px-4 py-2.5 mt-0 md:mt-5 bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 rounded-lg text-sm font-medium transition-colors border border-red-800/50 whitespace-nowrap"
            >
              Delete Cycle
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Configure Your Cycle</h2>

        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Cycle Name</label>
            <input
              type="text"
              value={splitName}
              onChange={(e) => setSplitName(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., PPL Rest"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              The date when the first item in your cycle begins.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-gray-300">Cycle Sequence</label>
          <button
            onClick={handleAddItem}
            className="text-sm px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-md transition-colors"
          >
            + Add Day
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={rectSortingStrategy}
            >
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  index={index}
                  handleChangeItem={handleChangeItem}
                  handleRemoveItem={handleRemoveItem}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700/50">
        <button
          onClick={handleSave}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 text-lg"
        >
          {selectedSplitId === "new" ? "Save New Cycle & Generate" : "Update Cycle & Generate"}
        </button>
      </div>
    </Card>
  );
}
