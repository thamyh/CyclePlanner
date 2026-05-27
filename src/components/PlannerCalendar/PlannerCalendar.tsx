"use client";
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { useSettings } from "@/lib/context/SettingsContext";
import Card from "@/components/UI/Card";
import { format, differenceInCalendarDays, startOfDay } from "date-fns";

export default function PlannerCalendar() {
  const { events, completedDates, dietPlan } = useSettings();
  const calendarRef = useRef<FullCalendar>(null);

  // Convert PlannerEvent to FullCalendar event format
  const fcEvents = events.map((ev) => ({
    title: ev.title,
    date: ev.start,
    color: ev.backgroundColor,
  }));

  return (
    <Card className="p-4 md:p-6 overflow-hidden">
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
          initialView="multiMonthSix"
          events={fcEvents}
          navLinks={true} // Allows clicking on a month header to go to dayGridMonth
          navLinkHint="Click to view month"
          buttonText={{
            multiMonthSix: "6 Months",
            dayGridMonth: "1 Month",
            today: "Today"
          }}
          views={{
            multiMonthSix: {
              type: "multiMonth",
              duration: { months: 6 },
              multiMonthMaxColumns: 3,
            },
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "multiMonthSix,dayGridMonth",
          }}
          height="auto"
          contentHeight="auto"
          dayCellContent={(arg) => {
            const isMultiMonth = arg.view.type === "multiMonthSix";
            const textClass = isMultiMonth ? "" : "text-sm md:text-base lg:text-lg";
            const defaultHtml = <div className={`fc-daygrid-day-number ${textClass} font-bold`}>{arg.dayNumberText}</div>;
            if (!dietPlan || !dietPlan.phases || dietPlan.phases.length === 0) return defaultHtml;

            const today = startOfDay(arg.date);
            const startDate = startOfDay(new Date(dietPlan.startDate));
            const daysDiff = differenceInCalendarDays(today, startDate);
            
            let phaseColor = null;
            if (daysDiff >= 0) {
              const currentWeek = Math.floor(daysDiff / 7) + 1;
              const activePhase = dietPlan.phases.find(
                (p) => currentWeek >= p.startWeek && currentWeek <= p.endWeek
              );
              if (activePhase) {
                phaseColor = activePhase.color;
              }
            }

            return (
              <div className="relative w-full h-full">
                {phaseColor && (
                  <div 
                    className="absolute inset-0 opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" 
                    style={{ backgroundColor: phaseColor }} 
                    title="Diet Phase Active"
                  />
                )}
                <div className="relative z-10">
                  {defaultHtml}
                </div>
              </div>
            );
          }}
          eventContent={(arg) => {
            const eventDateStr = arg.event.start ? format(arg.event.start, "yyyy-MM-dd") : "";
            const isCompleted = completedDates.includes(eventDateStr);

            // Keep it minimal in multiMonth view to avoid clutter
            const isMultiMonth = arg.view.type === "multiMonthSix";
            
            if (isMultiMonth) {
              return (
                <div 
                  className="w-full h-1.5 rounded-full mt-0.5 flex justify-center items-center overflow-hidden" 
                  style={{ backgroundColor: arg.event.backgroundColor }}
                  title={arg.event.title}
                >
                  {isCompleted && <span className="text-[6px] text-white font-bold leading-none">✓</span>}
                </div>
              );
            }
            return (
              <div 
                className={`p-1 text-xs md:text-sm font-semibold rounded-md truncate w-full text-white flex items-center justify-center gap-1 border-2 ${
                  isCompleted ? "border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "border-transparent"
                }`}
                style={{ backgroundColor: arg.event.backgroundColor }}
                title={arg.event.title}
              >
                {arg.event.title}
                {isCompleted && <span className="text-green-300 font-bold text-sm">✓</span>}
              </div>
            );
          }}
        />
      </div>
      <style jsx global>{`
        .calendar-container .fc {
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.05);
          --fc-neutral-text-color: #e5e7eb;
          --fc-border-color: rgba(255, 255, 255, 0.1);
          --fc-button-text-color: #fff;
          --fc-button-bg-color: rgba(255, 255, 255, 0.1);
          --fc-button-border-color: rgba(255, 255, 255, 0.2);
          --fc-button-hover-bg-color: rgba(255, 255, 255, 0.2);
          --fc-button-hover-border-color: rgba(255, 255, 255, 0.3);
          --fc-button-active-bg-color: rgba(255, 255, 255, 0.3);
          --fc-button-active-border-color: rgba(255, 255, 255, 0.4);
          --fc-event-bg-color: transparent;
          --fc-event-border-color: transparent;
          --fc-today-bg-color: rgba(255, 255, 255, 0.08);
          color: #f3f4f6;
          font-family: inherit;
        }
        .calendar-container .fc-theme-standard td, .calendar-container .fc-theme-standard th {
          border-color: var(--fc-border-color);
        }
        .calendar-container .fc-daygrid-day-number {
          color: #9ca3af;
          padding: 8px;
          position: relative;
          z-index: 10;
        }
        .calendar-container .fc-daygrid-day-frame {
          position: relative;
          overflow: hidden;
        }
        .calendar-container .fc-col-header-cell-cushion {
          color: #d1d5db;
          padding: 12px 0;
        }
        
        /* multiMonth specific styling tweaks */
        .calendar-container .fc-multimonth-title {
          color: #f3f4f6;
          font-size: clamp(0.75rem, 2.5vw, 1.1rem); 
          font-weight: 600;
          padding: 1rem 0 0.5rem 0;
          cursor: pointer;
        }
        .calendar-container .fc-multimonth-title:hover {
          color: #60a5fa;
          text-decoration: underline;
        }
        .calendar-container .fc-multimonth-month {
          padding: 0.5rem;
        }
        .calendar-container .fc .fc-multimonth-daygrid {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        /* May – October 2026 標題 */
        .calendar-container .fc-toolbar-title {
          font-size: clamp(0.85rem, 3.5vw, 1.25rem);
        }

        /* 6 Months / 1 Month / Today 按鈕 */
        .calendar-container .fc-button {
          font-size: clamp(0.6rem, 1.8vw, 0.875rem);
          padding: clamp(0.2rem, 0.8vw, 0.4rem) clamp(0.4rem, 1.5vw, 0.75rem);
        }

        /* < > 箭頭按鈕 */
        .calendar-container .fc-prev-button,
        .calendar-container .fc-next-button {
          font-size: clamp(0.7rem, 2vw, 1rem);
          padding: clamp(0.2rem, 0.8vw, 0.4rem) clamp(0.35rem, 1.2vw, 0.6rem);
        }
        
      `}</style>
    </Card>
  );
}
