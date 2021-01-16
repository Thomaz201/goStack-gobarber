import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUsersService from './CreateUsersService';

describe('CreateUser tests', () => {
  it('should be able to create an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUsersService.execute({
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456'
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create an user if the email is already being used', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUsersService.execute({
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456'
    });

    await expect(createUsersService.execute({
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });
});
