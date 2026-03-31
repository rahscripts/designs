"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#30363d",
  accent: "#39d353",
  accentDim: "#26a641",
  accentFaint: "#0e4429",
  text: "#e6edf3",
  textMuted: "#7d8590",
  red: "#f85149",
  yellow: "#d29922",
};

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

interface Todo {
  id: number;
  text: string;
  createdAt: string;
}

interface Completions {
  [dateKey: string]: Set<number>;
}

export default function TodoDashboard() {
  const [input, setInput] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  // completions: { [dateKey]: Set of todoIds }
  const [completions, setCompletions] = useState<Completions>({});

  const todayKey = getTodayKey();
  const days = getLast30Days();

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, createdAt: todayKey },
    ]);
    setInput("");
  };

  const toggleCompletion = (todoId: number, dateKey: string) => {
    setCompletions((prev) => {
      const daySet = new Set(prev[dateKey] || []);
      if (daySet.has(todoId)) daySet.delete(todoId);
      else daySet.add(todoId);
      return { ...prev, [dateKey]: daySet };
    });
  };

  const isCompleted = (todoId: number, dateKey: string): boolean =>
    !!(completions[dateKey] && completions[dateKey].has(todoId));

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setCompletions((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        const s = new Set(next[k]);
        s.delete(id);
        next[k] = s;
      });
      return next;
    });
  };

  // Chart data: per-day stats
  const chartData = useMemo(() => {
    return days.map((day) => {
      const done = completions[day] ? completions[day].size : 0;
      const total = todos.length;
      const rate = total > 0 ? Math.round((done / total) * 100) : 0;
      return { date: formatDate(day), completed: done, total, rate };
    });
  }, [days, completions, todos]);

  // Heatmap intensity for a day
  const heatLevel = (dateKey: string): number => {
    if (!todos.length) return 0;
    const done = completions[dateKey] ? completions[dateKey].size : 0;
    if (done === 0) return 0;
    const ratio = done / todos.length;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  const heatColors = [
    "#161b22",
    "#0e4429",
    "#006d32",
    "#26a641",
    "#39d353",
  ];

  const todayDone = completions[todayKey] ? completions[todayKey].size : 0;
  const todayPct = todos.length > 0 ? Math.round((todayDone / todos.length) * 100) : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        padding: "32px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22, color: COLORS.accent }}>◆</span>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: COLORS.text }}>
            task.board
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: COLORS.textMuted }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          <span style={{ color: COLORS.accent }}>{todayDone}/{todos.length}</span> done today ({todayPct}%)
        </p>
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 28,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: "6px 8px",
        }}
      >
        <span style={{ color: COLORS.accent, lineHeight: "36px", fontSize: 14 }}>$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="add new task and press Enter..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: COLORS.text,
            fontSize: 14,
            fontFamily: "inherit",
            padding: "8px 0",
          }}
        />
        <button
          onClick={addTodo}
          style={{
            background: COLORS.accentFaint,
            color: COLORS.accent,
            border: `1px solid ${COLORS.accentDim}`,
            borderRadius: 6,
            padding: "6px 16px",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
            fontWeight: 600,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = COLORS.accentDim)}
          onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = COLORS.accentFaint)}
        >
          + add
        </button>
      </div>

      {/* Main Grid: Todo List + Heatmap */}
      {todos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 0,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          {/* Todo List Column */}
          <div style={{ borderRight: `1px solid ${COLORS.border}`, minWidth: 220 }}>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: `1px solid ${COLORS.border}`,
                fontSize: 11,
                color: COLORS.textMuted,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 600,
              }}
            >
              tasks ({todos.length})
            </div>
            {todos.map((todo, i) => (
              <div
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  borderBottom: i < todos.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  fontSize: 13,
                  height: 40,
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    color: isCompleted(todo.id, todayKey) ? COLORS.accent : COLORS.textMuted,
                    fontSize: 10,
                  }}
                >
                  {isCompleted(todo.id, todayKey) ? "✓" : "○"}
                </span>
                <span
                  style={{
                    flex: 1,
                    color: isCompleted(todo.id, todayKey) ? COLORS.textMuted : COLORS.text,
                    textDecoration: isCompleted(todo.id, todayKey) ? "line-through" : "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: COLORS.textMuted,
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 2px",
                    lineHeight: 1,
                    opacity: 0.4,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.color = COLORS.red;
                    target.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.color = COLORS.textMuted;
                    target.style.opacity = "0.4";
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Heatmap Column */}
          <div style={{ overflowX: "auto" }}>
            {/* Date Headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(30, 40px)`,
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              {days.map((day) => (
                <div
                  key={day}
                  style={{
                    padding: "10px 4px",
                    fontSize: 9,
                    color: day === todayKey ? COLORS.accent : COLORS.textMuted,
                    textAlign: "center",
                    fontWeight: day === todayKey ? 700 : 400,
                    borderRight: `1px solid ${COLORS.border}`,
                    letterSpacing: 0,
                  }}
                >
                  {new Date(day + "T00:00:00").getDate()}
                  <br />
                  <span style={{ fontSize: 8 }}>
                    {new Date(day + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
              ))}
            </div>

            {/* Checkbox Grid */}
            {todos.map((todo, i) => (
              <div
                key={todo.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(30, 40px)`,
                  borderBottom: i < todos.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  height: 40,
                }}
              >
                {days.map((day) => {
                  const done = isCompleted(todo.id, day);
                  return (
                    <div
                      key={day}
                      onClick={() => toggleCompletion(todo.id, day)}
                      title={`${todo.text} — ${formatDate(day)}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRight: `1px solid ${COLORS.border}`,
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#21262d")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 3,
                          border: `1.5px solid ${done ? COLORS.accentDim : COLORS.border}`,
                          background: done ? heatColors[heatLevel(day)] : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s",
                          boxShadow: done ? `0 0 6px ${COLORS.accentFaint}` : "none",
                        }}
                      >
                        {done && (
                          <span style={{ color: COLORS.accent, fontSize: 10, lineHeight: 1 }}>✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Heatmap legend row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "8px 16px",
                justifyContent: "flex-end",
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <span style={{ fontSize: 10, color: COLORS.textMuted, marginRight: 4 }}>less</span>
              {heatColors.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: c,
                    border: `1px solid ${COLORS.border}`,
                  }}
                />
              ))}
              <span style={{ fontSize: 10, color: COLORS.textMuted, marginLeft: 4 }}>more</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {todos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: COLORS.textMuted,
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 10,
            marginBottom: 32,
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>◇</div>
          <div>No tasks yet. Add one above.</div>
        </div>
      )}

      {/* Charts Section */}
      {todos.length > 0 && (
        <>
          <div
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontWeight: 600,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: COLORS.accent }}>▸</span> activity overview — last 30 days
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {/* Chart 1: Tasks Completed */}
            <ChartCard title="Tasks Completed" subtitle="count per day">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#39d353" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#0e4429" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    interval={9}
                  />
                  <YAxis
                    tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: "inherit",
                      color: COLORS.text,
                    }}
                    labelStyle={{ color: COLORS.textMuted }}
                    itemStyle={{ color: COLORS.accent }}
                    cursor={{ stroke: COLORS.border }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#39d353"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#39d353", stroke: COLORS.bg }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Chart 2: Completion Rate % */}
            <ChartCard title="Completion Rate" subtitle="% of total tasks">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#26a641" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#006d32" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    interval={9}
                  />
                  <YAxis
                    tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: "inherit",
                      color: COLORS.text,
                    }}
                    labelStyle={{ color: COLORS.textMuted }}
                    itemStyle={{ color: "#26a641" }}
                    cursor={{ stroke: COLORS.border }}
                    formatter={(v) => [`${v}%`, "rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#26a641"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#26a641", stroke: COLORS.bg }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Chart 3: Cumulative Progress */}
            <ChartCard title="Cumulative Done" subtitle="running total">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={chartData.map((d, i) => ({
                    ...d,
                    cumulative: chartData.slice(0, i + 1).reduce((acc, x) => acc + x.completed, 0),
                  }))}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ae168" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#1a7f37" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    interval={9}
                  />
                  <YAxis
                    tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: "inherit",
                      color: COLORS.text,
                    }}
                    labelStyle={{ color: COLORS.textMuted }}
                    itemStyle={{ color: "#4ae168" }}
                    cursor={{ stroke: COLORS.border }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#4ae168"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#4ae168", stroke: COLORS.bg }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function ChartCard({ title, subtitle, children }: {title: string; subtitle: string; children: React.ReactNode}) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: "16px",
        overflow: "hidden",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, letterSpacing: "-0.3px" }}>
          {title}
        </div>
        <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}