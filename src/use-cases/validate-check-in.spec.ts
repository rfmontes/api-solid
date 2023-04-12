import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidateError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate Check in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check in', async () => {
    await expect(() => 
      validateCheckInUseCase.execute({
        checkInId: 'inexistent-check-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 3, 11, 8, 0, 0))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const thirtyMinutesInMs = 1000 * 60 * 30
    vi.advanceTimersByTime(thirtyMinutesInMs)

    await expect(() => 
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidateError)
  })
})