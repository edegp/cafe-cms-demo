import { Course } from "./../store/index"
export type Area = {
  code: string
  name: string
}

export type ReserveEvent = {
  id: number
  shopId: number
  name: string
  start: string
  end: string
  color: string
  reserved: number
}

export type Reservation = {
  status: number
  name: string
  start: string
  end: string
  events: []
}
