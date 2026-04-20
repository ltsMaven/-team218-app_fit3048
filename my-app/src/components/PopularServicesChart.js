"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const CHART_COLORS = ["#04a6c8", "#3f8ed8", "#f4ad16", "#7ab800", "#7b8a8b"];

function getChartColor(index) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

function getTotal(events) {
  return events.reduce((sum, event) => sum + event.count, 0);
}

function getPercent(count, total) {
  return Math.round((count / Math.max(total, 1)) * 100);
}

export default function PopularServicesChart({ events }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const totalBookings = getTotal(events);

  useEffect(() => {
    if (!canvasRef.current || !events.length) {
      return undefined;
    }

    const labels = events.map((event) => event.name);
    const values = events.map((event) => event.count);
    const colors = events.map((_, index) => getChartColor(index));
    const total = getTotal(events);

    const percentLabelsPlugin = {
      id: "percentLabels",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);

        ctx.save();
        ctx.fillStyle = "#17212b";
        ctx.font = "700 18px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        meta.data.forEach((arc, index) => {
          const percent = getPercent(values[index], total);

          if (percent < 6) {
            return;
          }

          const position = arc.tooltipPosition();
          ctx.fillText(`${percent}%`, position.x, position.y);
        });

        ctx.restore();
      },
    };

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 700,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label(context) {
                const value = Number(context.raw || 0);
                return `${context.label}: ${value} bookings (${getPercent(
                  value,
                  total,
                )}%)`;
              },
            },
          },
        },
      },
      plugins: [percentLabelsPlugin],
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [events]);

  if (!events.length) {
    return null;
  }

  return (
    <div className="mt-8 grid items-center gap-8 lg:grid-cols-[22rem_1fr]">
      <div className="flex items-center justify-center">
        <div className="h-[22rem] w-[22rem]">
          <canvas ref={canvasRef} aria-label="Popular services pie chart" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#d8dfeb] bg-white/70">
        <div className="flex items-center justify-between gap-3 border-b border-[#d8dfeb] px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Services
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Share
          </p>
        </div>
        {events.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: getChartColor(index),
                }}
              />
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-[#42454c]">
                  {item.name}
                </p>
                <p className="text-sm text-[#5d6169]">
                  {item.count} bookings
                </p>
              </div>
            </div>
            <span className="shrink-0 text-base font-semibold text-[#926ab9]">
              {getPercent(item.count, totalBookings)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
