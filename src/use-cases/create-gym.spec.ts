import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => { 
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })
  
  it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Javascript Gym',
      latitude: -23.5987303,
      longitude: -46.5181258,
      description: null,
      phone: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})