import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => { 
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
  })
  
  it('should be able to fetch nearby for gyms', async () => {
    gymsRepository.create({
      title: 'Near Gym 1',
      latitude: -23.5987303,
      longitude: -46.5181258,
      description: null,
      phone: null,
    })

    gymsRepository.create({
      title: 'Near Gym 2',
      latitude: -23.5987303,
      longitude: -46.5181258,
      description: null,
      phone: null,
    })

    gymsRepository.create({
      title: 'Far Gym',
      latitude: -23.5296049,
      longitude: -46.6970689,
      description: null,
      phone: null,
    })

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -23.5987303,
      userLongitude: -46.5181258,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym 1' }),
      expect.objectContaining({ title: 'Near Gym 2' }),
    ])
  })
})