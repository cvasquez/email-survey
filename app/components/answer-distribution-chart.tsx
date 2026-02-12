'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Props = {
  answerCounts: [string, { total: number; withComments: number }][]
  totalResponses: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const withComments = payload.find((p: any) => p.dataKey === 'withComments')?.value || 0
  const withoutComments = payload.find((p: any) => p.dataKey === 'withoutComments')?.value || 0
  const total = (withComments as number) + (withoutComments as number)
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-gray-900 mb-1">{label}</p>
      <p className="text-gray-600">{total} responses</p>
      <p className="text-blue-600">{withComments} with comments</p>
    </div>
  )
}

export function AnswerDistributionChart({ answerCounts, totalResponses }: Props) {
  if (answerCounts.length === 0) return null

  const data = answerCounts.map(([name, { total, withComments }]) => ({
    name,
    withComments,
    withoutComments: total - withComments,
  }))

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, answerCounts.length * 50)}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" fontSize={12} tickLine={false} />
        <YAxis type="category" dataKey="name" width={120} fontSize={12} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend fontSize={12} />
        <Bar dataKey="withComments" stackId="a" fill="#3b82f6" name="With Comments" radius={[0, 0, 0, 0]} />
        <Bar dataKey="withoutComments" stackId="a" fill="#93c5fd" name="Without Comments" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
