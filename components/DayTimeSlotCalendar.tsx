import { FC, useMemo } from "react"
import { Calendar, Culture, DateLocalizer } from "react-big-calendar"
import { ReserveEvent } from "types/Restaurant"

export const DayTimeSlotCalendar: FC<{
  events: ReserveEvent[]
  localizer: DateLocalizer
  reserveDate: string
  handleNavigate: (date: Date) => void
  minDate: string
  maxDate: string
  handleSelectEvent: (event: any) => void
  start: number
  end: number
  [key: string]: any
}> = ({
  events,
  localizer,
  reserveDate,
  handleNavigate,
  minDate,
  maxDate,
  handleSelectEvent,
  start,
  end,
  ...other
}) => {
  // Memoize processed events
  const processedEvents = useMemo(() => {
    return events.slice((start - 10) * 2).map((event, index) => ({
      id: index,
      title: event.name,
      start: new Date(new Date(event.start.replace(" ", "T"))),
      end: new Date(new Date(event.end.replace(" ", "T"))),
    }))
  }, [events, start])

  // Memoize min and max date
  const min = useMemo(() => {
    return new Date(
      parseInt(minDate.slice(0, 4), 10),
      parseInt(minDate.slice(4, 6), 10),
      parseInt(minDate.slice(6, 8), 10),
      start,
      0,
      0
    )
  }, [minDate, start])

  const max = useMemo(() => {
    return new Date(
      parseInt(maxDate.slice(0, 4), 10),
      parseInt(maxDate.slice(4, 6), 10),
      parseInt(maxDate.slice(6, 8), 10),
      end,
      0,
      0
    )
  }, [maxDate, end])
  return (
    <Calendar
      className="w-full"
      events={processedEvents}
      step={30}
      views={["day"]}
      defaultView="day"
      localizer={localizer}
      timeslots={2}
      date={new Date(reserveDate)}
      onNavigate={handleNavigate}
      messages={{
        previous: "前の日",
        next: "次の日",
        today: "今日",
      }}
      min={min}
      max={max}
      eventPropGetter={(event) => ({
        className:
          "odd:bg-slate-500/70 even:bg-primary/80 border-white pl-vw-36 align-items-center space-between",
        key: event.id,
      })}
      onSelectEvent={handleSelectEvent}
      toolbar={start === 10}
      formats={{
        dayHeaderFormat: (
          date: Date,
          culture: Culture,
          localizer: DateLocalizer
        ) => localizer.format(date, "M[月] D[日] dddd", culture) || "",
      }}
      {...other}
    />
  )
}
