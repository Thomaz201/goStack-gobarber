import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProfilesService: ListProvidersService;

describe('ListProviders tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProfilesService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'anakin@teste.com',
      name: 'Anakin',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'dhindjarin@teste.com',
      name: 'Dhin Djarin',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      email: 'ashokathano@teste.com',
      name: 'Ashoka Thano',
      password: '123456',
    });

    const providers = await listProfilesService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
