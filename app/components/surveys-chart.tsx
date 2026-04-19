'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type SurveyChartData = {
  title: string
  response_count: number
  comment_count: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const answers = payload.find((p: any) => p.dataKey === 'response_count')?.value || 0
  const comments = payload.find((p: any) => p.dataKey === 'comment_count')?.value || 0
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-[#EDEDED] mb-1">{label}</p>
      <p className="text-[#3B82F6]">{answers} answers</p>
      <p className="text-[#22C55E]">{comments} comments</p>
    </div>
  )
}

export function SurveysChart({ surveys }: { surveys: SurveyChartData[] }) {
  if (surveys.length === 0) return null

  const data = [...surveys].reverse().map((s) => ({
    name: s.title.length > 20 ? s.title.slice(0, 20) + '…' : s.title,
    response_count: s.response_count,
    comment_count: s.comment_count,
  }))

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 sm:p-6 mb-6">
      <h3 className="text-sm font-medium text-[#A1A1A1] uppercase tracking-wider mb-4">
        Answers &amp; Comments by Survey
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid vertical={false} stroke="#262626" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#A1A1A1', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={surveys.length > 5 ? -30 : 0}
            textAnchor={surveys.length > 5 ? 'end' : 'middle'}
            height={surveys.length > 5 ? 60 : 30}
          />
          <YAxis tick={{ fill: '#666666', fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333333' }} />
          <Line
            type="monotone"
            dataKey="response_count"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="comment_count"
            stroke="#22C55E"
            strokeWidth={2}
            dot={{ r: 4, fill: '#22C55E', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#22C55E', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-3 text-xs text-[#A1A1A1]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#3B82F6]" />
          Answers
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#22C55E]" />
          Comments
        </div>
      </div>
    </div>
  )
}
