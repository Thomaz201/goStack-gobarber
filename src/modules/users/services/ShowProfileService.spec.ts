import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it("should be able to list an user's profile", async () => {
    const user = await fakeUsersRepository.create({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '123456',
    });

    const listedUser = await showProfileService.execute({
      user_id: user.id,
    });

    expect(listedUser.name).toBe('Teste');
    expect(listedUser.email).toBe('teste@teste.com');
  });

  it("should not be able to list an user's profile if the user does not exist", async () => {
    await expect(
      showProfileService.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
