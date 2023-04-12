import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let getUserMetricsUseCase: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'New Gym',
      latitude: -23.6073611,
      longitude: -46.5045348,
      description: '',
      phone: '',
    })
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: '123',
    })

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: '123',
    })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: '123',
    })
    
    expect(checkInsCount).toEqual(2)
  })
})