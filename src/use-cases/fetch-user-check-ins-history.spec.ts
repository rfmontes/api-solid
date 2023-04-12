import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase

describe('Fetch User check ins history Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'New Gym',
      latitude: -23.6073611,
      longitude: -46.5045348,
      description: '',
      phone: '',
    })
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: '123',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: '123',
    })

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: '123',
      page: 1
    })
    
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: '123',
      })
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: '123',
      page: 2,
    })
    
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})