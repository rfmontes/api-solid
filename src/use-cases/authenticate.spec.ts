import { beforeEach, describe, expect, it, test } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Rafael F. Montes',
      email: 'rafa@teste.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await authenticateUseCase.execute({
      email: 'rafa@teste.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with email invalid', async () => {
    await usersRepository.create({
      name: 'Rafael F. Montes',
      email: 'rafa@teste.com',
      password_hash: await hash('123456', 6)
    })

    await expect(() => 
      authenticateUseCase.execute({
        email: 'rafafmontes@teste.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with password invalid', async () => {
    await usersRepository.create({
      name: 'Rafael F. Montes',
      email: 'rafa@teste.com',
      password_hash: await hash('123456', 6)
    })

    await expect(() => 
      authenticateUseCase.execute({
        email: 'rafa@teste.com',
        password: '000000',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})