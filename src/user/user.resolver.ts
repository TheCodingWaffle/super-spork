import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../core/decorators/decorators';
import { User } from './user.entity';
import { UserInput } from './user.input';
import { UserService } from './user.service';
import '../core/transformers/user.util';
import { GqlAuthGuard } from 'src/core/strategies/gql.strategy';

@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => Boolean)
  async alive(): Promise<Boolean> {
    return true;
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getUserById(@Args('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: any) {
    return this.userService.getUserById(user.id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: UserInput): Promise<User> {
    return this.userService.createUser(UserInput.prototype.toEntity(input));
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateUser(@Args('input') input: UserInput): Promise<boolean> {
    return this.userService.updateUser(UserInput.prototype.toEntity(input));
  }

  @Mutation(() => User)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.userService.validateUser(email, password);

    if (user) {
      user.LastLogin = Date.now();
      this.userService.updateUser(user);
      return this.userService.createJwtToken(user);
    } else {
      throw new UnauthorizedException();
    }
  }
}
