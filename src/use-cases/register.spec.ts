import { beforeEach, describe, expect, it, test } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => { 
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })
  
  it('should be able to register', async () => {
    const email = 'rafa@teste.com'

    const { user } = await registerUseCase.execute({
      name: 'Rafa',
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Rafa',
      email: 'rafa@teste.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456', 
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'rafa@teste.com'

    await registerUseCase.execute({
      name: 'Rafa',
      email,
      password: '123456',
    })

    await expect(() => 
      registerUseCase.execute({
        name: 'Rafa',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})