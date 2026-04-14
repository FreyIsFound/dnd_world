(function () {
  const MOON_PHASES = [
    { name: "New", icon: "🌑" },
    { name: "Young", icon: "🌒" },
    { name: "Waxing Crescent", icon: "🌒" },
    { name: "Waxing Quarter", icon: "🌓" },
    { name: "Waxing Gibbous", icon: "🌔" },
    { name: "Full", icon: "🌕" },
    { name: "Waning Gibbous", icon: "🌖" },
    { name: "Waning Quarter", icon: "🌗" },
    { name: "Waning Crescent", icon: "🌘" },
    { name: "Old", icon: "🌘" },
  ]

  function getPhase(dayOfYear, cycle, shift) {
    const adjusted = ((dayOfYear - 1 + shift) % cycle + cycle) % cycle
    const ratio = adjusted / cycle

    if (ratio < 0.05) return MOON_PHASES[0]
    if (ratio < 0.15) return MOON_PHASES[1]
    if (ratio < 0.25) return MOON_PHASES[2]
    if (ratio < 0.35) return MOON_PHASES[3]
    if (ratio < 0.45) return MOON_PHASES[4]
    if (ratio < 0.55) return MOON_PHASES[5]
    if (ratio < 0.65) return MOON_PHASES[6]
    if (ratio < 0.75) return MOON_PHASES[7]
    if (ratio < 0.85) return MOON_PHASES[8]
    return MOON_PHASES[9]
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;")
  }

  async function init() {
    const mount = document.getElementById("aisling-calendar")
    if (!mount) return

    const src = "/data/calendar/calendar.json"

    let calendar
    try {
      const res = await fetch(src)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      calendar = await res.json()
    } catch (err) {
      mount.innerHTML = `<p>Could not load calendar JSON: ${escapeHtml(err.message)}</p>`
      return
    }

    const days = calendar.days || []
    const months = calendar.months || []
    const daysPerWeek = Number(calendar.daysPerWeek || days.length || 8)
    const monthLengths = months.map((m) => Number(m.length || 0))
    const totalDaysInYear = monthLengths.reduce((a, b) => a + b, 0)

    const celestial = calendar.celestials?.[0]
    const moonCycle = Number(celestial?.cycle || totalDaysInYear || 360)
    const moonShift = Number(celestial?.shift || 0)
    const moonName = celestial?.name || "Moon"

    let currentMonthIndex = 0

    function getDayOfYear(monthIndex, day) {
      let offset = 0
      for (let i = 0; i < monthIndex; i++) offset += monthLengths[i]
      return offset + day
    }

    function render() {
      const month = months[currentMonthIndex]
      const monthLength = Number(month.length)
      const weeks = Math.ceil(monthLength / daysPerWeek)

      let html = `
        <div class="aisling-cal">
          <div class="aisling-cal__top">
            <button type="button" class="aisling-cal__btn" data-action="prev-month" aria-label="Previous month">←</button>
            <div class="aisling-cal__titlewrap">
              <div class="aisling-cal__title">${escapeHtml(month.name)}</div>
            </div>
            <button type="button" class="aisling-cal__btn" data-action="next-month" aria-label="Next month">→</button>
          </div>

          <p class="aisling-cal__desc">${escapeHtml(month.desc || "")}</p>

          <div class="aisling-cal__tablewrap">
            <table class="aisling-cal__table">
              <thead>
                <tr>
                  ${days.map((d) => `<th>${escapeHtml(d)}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
      `

      let day = 1
      for (let w = 0; w < weeks; w++) {
        html += "<tr>"
        for (let i = 0; i < daysPerWeek; i++) {
          if (day <= monthLength) {
            const dayOfYear = getDayOfYear(currentMonthIndex, day)
            const phase = getPhase(dayOfYear, moonCycle, moonShift)

            html += `
              <td class="aisling-cal__cell">
                <div class="aisling-cal__daynum">${day}</div>
                <div class="aisling-cal__moon" title="${escapeHtml(moonName)}: ${escapeHtml(phase.name)}">
                  <span class="aisling-cal__moonicon">${phase.icon}</span>
                </div>
              </td>
            `
            day++
          } else {
            html += `<td class="aisling-cal__cell aisling-cal__cell--empty"></td>`
          }
        }
        html += "</tr>"
      }

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `

      mount.innerHTML = html

      mount.querySelector('[data-action="prev-month"]')?.addEventListener("click", () => {
        currentMonthIndex--
        if (currentMonthIndex < 0) currentMonthIndex = months.length - 1
        render()
      })

      mount.querySelector('[data-action="next-month"]')?.addEventListener("click", () => {
        currentMonthIndex++
        if (currentMonthIndex >= months.length) currentMonthIndex = 0
        render()
      })
    }

    render()
  }

  function injectStyles() {
  if (document.getElementById("aisling-calendar-styles")) return

  const style = document.createElement("style")
  style.id = "aisling-calendar-styles"
  style.textContent = `
  .aisling-cal {
    margin: 1rem 0;
    font-size: 0.9rem;
    max-width: 100%;
  }

  .aisling-cal__top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    max-width: 100%;
  }

  .aisling-cal__titlewrap {
    text-align: center;
    min-width: 0;
    flex: 1 1 auto;
  }

  .aisling-cal__title {
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .aisling-cal__btn {
    border: 1px solid rgba(127, 127, 127, 0.35);
    background: transparent;
    padding: 0.3rem 0.55rem;
    border-radius: 0.4rem;
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
    flex: 0 0 auto;
  }

  .aisling-cal__btn:hover {
    background: rgba(127, 127, 127, 0.08);
  }

  .aisling-cal__desc {
    text-align: center;
    margin: 0 auto 0.9rem;
    max-width: 62ch;
    opacity: 0.82;
    font-size: 0.8rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .aisling-cal__tablewrap {
    width: 100%;
    max-width: 100%;
  }

  .aisling-cal__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 0.82rem;
  }

  .aisling-cal__table th,
  .aisling-cal__table td {
    border: 1px solid rgba(127, 127, 127, 0.22);
  }

  .aisling-cal__table th {
    text-align: center;
    padding: 0.45rem 0.2rem;
    font-size: 0.72rem;
    font-weight: 600;
    opacity: 0.8;
  }

  .aisling-cal__cell {
    padding: 0.35rem 0.25rem;
    height: 3.2rem;
    vertical-align: top;
  }

  .aisling-cal__cell--empty {
    background: rgba(127, 127, 127, 0.03);
  }

  .aisling-cal__daynum {
    font-size: 0.78rem;
    font-weight: 700;
    margin-bottom: 0.15rem;
    line-height: 1;
  }

  .aisling-cal__moon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.2rem;
  }

  .aisling-cal__moonicon {
    font-size: 1rem;
    line-height: 1;
  }

  @media (max-width: 900px) {
    .aisling-cal {
      font-size: 0.82rem;
    }

    .aisling-cal__top {
      gap: 0.4rem;
    }

    .aisling-cal__title {
      font-size: 1rem;
    }

    .aisling-cal__btn {
      padding: 0.25rem 0.45rem;
      font-size: 0.82rem;
    }

    .aisling-cal__tablewrap {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .aisling-cal__table {
      width: max-content;
      min-width: 26rem;
      font-size: 0.74rem;
    }

    .aisling-cal__table th,
    .aisling-cal__table td {
      min-width: 3.4rem;
    }

    .aisling-cal__cell {
      height: 2.8rem;
      padding: 0.28rem 0.18rem;
    }

    .aisling-cal__moonicon {
      font-size: 0.9rem;
    }
  }
`
  document.head.appendChild(style)
}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectStyles()
      init()
    })
  } else {
    injectStyles()
    init()
  }
})()