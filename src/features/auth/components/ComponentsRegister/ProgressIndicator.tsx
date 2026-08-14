import React from 'react'

interface Props {
  steps: string[]
  current: number
}

export const ProgressIndicator: React.FC<Props> = ({ steps, current }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white transition ${
              i <= current ? 'bg-[#7C3AED]' : 'bg-slate-700/70'
            }`}
          >
            {i + 1}
          </div>
          <span className={`text-xs font-medium ${i <= current ? 'text-white' : 'text-slate-400'}`}>
            {s}
          </span>
        </div>
      ))}
    </div>
  )
}
