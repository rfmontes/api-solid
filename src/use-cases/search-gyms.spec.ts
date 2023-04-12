import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => { 
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })
  
  it('should be able to search for gyms', async () => {
    gymsRepository.create({
      title: 'Javascript Gym',
      latitude: -23.5987303,
      longitude: -46.5181258,
      description: null,
      phone: null,
    })

    gymsRepository.create({
      title: 'Python Gym',
      latitude: -23.5987303,
      longitude: -46.5181258,
      description: null,
      phone: null,
    })

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Python',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      gymsRepository.create({
        title: `Python Gym ${i}`,
        latitude: -23.5987303,
        longitude: -46.5181258,
        description: null,
        phone: null,
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Python',
      page: 2,
    })
    
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Python Gym 21' }),
      expect.objectContaining({ title: 'Python Gym 22' }),
    ])
  })
})