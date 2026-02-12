'use client'

import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Map common short names to Natural Earth names used in TopoJSON
const COUNTRY_NAME_MAP: Record<string, string> = {
  'United States': 'United States of America',
  'USA': 'United States of America',
  'US': 'United States of America',
  'UK': 'United Kingdom',
  'Russia': 'Russia',
  'South Korea': 'South Korea',
  'North Korea': 'North Korea',
  'Czech Republic': 'Czechia',
  'Czechia': 'Czechia',
  'UAE': 'United Arab Emirates',
}

// Reverse map: TopoJSON name → our name (for lookup)
const REVERSE_MAP: Record<string, string> = {}
for (const [short, long] of Object.entries(COUNTRY_NAME_MAP)) {
  REVERSE_MAP[long] = short
}

type Props = {
  countries: [string, number][]
}

export function ResponseMap({ countries }: Props) {
  const [tooltip, setTooltip] = useState<{ name: string; count: number } | null>(null)

  const { countryData, maxCount } = useMemo(() => {
    const map = new Map<string, number>()
    for (const [country, count] of countries) {
      // Store under both the original name and the TopoJSON-mapped name
      map.set(country, count)
      const mapped = COUNTRY_NAME_MAP[country]
      if (mapped) map.set(mapped, count)
    }
    const max = countries.length > 0 ? countries[0][1] : 0
    return { countryData: map, maxCount: max }
  }, [countries])

  if (countries.length === 0) return null

  function getColor(geoName: string): string {
    const count = countryData.get(geoName) || 0
    if (count === 0) return '#f3f4f6'
    const intensity = Math.max(0.2, count / maxCount)
    return `rgba(37, 99, 235, ${intensity})`
  }

  function getCount(geoName: string): number {
    return countryData.get(geoName) || 0
  }

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [0, 30] }}
        height={350}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name
              const count = getCount(name)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(name)}
                  stroke="#d1d5db"
                  strokeWidth={0.5}
                  onMouseEnter={() => {
                    if (count > 0) {
                      const displayName = REVERSE_MAP[name] || name
                      setTooltip({ name: displayName, count })
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: count > 0 ? '#2563eb' : '#e5e7eb', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      {tooltip && (
        <div className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm pointer-events-none">
          <p className="font-medium text-gray-900">{tooltip.name}</p>
          <p className="text-gray-600">{tooltip.count} {tooltip.count === 1 ? 'response' : 'responses'}</p>
        </div>
      )}
    </div>
  )
}
