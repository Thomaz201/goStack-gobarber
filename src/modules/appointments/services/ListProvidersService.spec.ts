import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { classToClass } from 'class-transformer';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProfilesService: ListProvidersService;

describe('ListProviders tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProfilesService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
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

    const cachedProviders = await listProfilesService.execute({
      user_id: loggedUser.id,
    });

    const parsedUser1 = classToClass(user1);
    const parsedUser2 = classToClass(user2);

    expect(providers).toEqual([user1, user2]);
    expect(cachedProviders).toEqual([parsedUser1, parsedUser2]);
  });
});
