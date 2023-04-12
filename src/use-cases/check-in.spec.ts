import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'New Gym',
      latitude: -23.6073611,
      longitude: -46.5045348,
      description: '',
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: '123',
      userLatitude: -23.6073611,
      userLongitude: -46.5045348,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in non exists gym', async () => {
    await expect(() => 
      checkInUseCase.execute({
        gymId: 'inexistent-gym',
        userId: '123',
        userLatitude: -23.6073611,
        userLongitude: -46.5045348,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to check in twice in the same day', async () => {
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: '123',
      userLatitude: -23.6073611,
      userLongitude: -46.5045348,
    })

    await expect(() => 
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: '123',
        userLatitude: -23.6073611,
        userLongitude: -46.5045348,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 9, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: '123',
      userLatitude: -23.6073611,
      userLongitude: -46.5045348,
    })

    vi.setSystemTime(new Date(2023, 3, 10, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: '123',
      userLatitude: -23.6073611,
      userLongitude: -46.5045348,
    })
    
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'New Gym',
      latitude: new Decimal(-23.6138266),
      longitude: new Decimal(-46.5020256),
      description: '',
      phone: '',
    })

    await expect(() => checkInUseCase.execute({
      gymId: 'gym-02',
      userId: '123',
      userLatitude: -23.6073611,
      userLongitude: -46.5045348,
    })).rejects.toBeInstanceOf(MaxDistanceError)
  })
})