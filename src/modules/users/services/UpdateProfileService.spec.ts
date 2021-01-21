import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it("should be able to update an user's profile", async () => {
    const user = await fakeUsersRepository.create({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Tre',
      email: 'jhontre@teste.com',
    });

    expect(updatedUser.name).toBe('Jhon Tre');
    expect(updatedUser.email).toBe('jhontre@teste.com');
  });

  it("should not be able to update an user's profile if it doesn't exist", async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-id',
        name: 'Jhon Tre',
        email: 'jhontre@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update an user's email into one that is already being used", async () => {
    await fakeUsersRepository.create({
      email: 'jhon@teste.com',
      name: 'Jhon',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      email: 'bran@teste.com',
      name: 'Bran',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Brandon',
        email: 'jhon@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update an user's password", async () => {
    const user = await fakeUsersRepository.create({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Tre',
      email: 'jhontre@teste.com',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it("should not be able to update an user's password without old password", async () => {
    const user = await fakeUsersRepository.create({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jhon Tre',
        email: 'jhontre@teste.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update an user's password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jhon Tre',
        email: 'jhontre@teste.com',
        old_password: '1234567',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
