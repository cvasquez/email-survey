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
    <div className="bg-[#fdf6ee] border border-[#e8dfd2] rounded-lg shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-[#2a1a10] mb-1">{label}</p>
      <p className="text-[#6b4f3f]">{total} responses</p>
      <p className="text-[#e66b67]">{withComments} with comments</p>
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
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8dfd2" />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={120} fontSize={12} tickLine={false} stroke="#a68b7a" tick={{ fill: '#6b4f3f' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend fontSize={12} wrapperStyle={{ color: '#6b4f3f' }} />
        <Bar dataKey="withComments" stackId="a" fill="#e66b67" name="With Comments" radius={[0, 0, 0, 0]} />
        <Bar dataKey="withoutComments" stackId="a" fill="#a68b7a" name="Without Comments" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
