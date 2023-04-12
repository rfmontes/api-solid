import { Prisma, CheckIn } from "@prisma/client";
import { randomUUID } from "crypto";
import { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn =  {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex(item => item.id === checkIn.id)

    if (checkInIndex > -1) {
      this.items[checkInIndex].validated_at = checkIn.validated_at
    }

    return checkIn
  }

  async findById(id: string) {
    const checkIn = this.items.find(item => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = this.items.find(item => {
      const isOnSameDate = item.created_at.toDateString() === date.toDateString()

      return item.user_id === userId && isOnSameDate
    })

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter(item => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async getCountCheckInsByUserId(userId: string) {
    return this.items
      .filter(item => item.user_id === userId)
      .length
  }

}