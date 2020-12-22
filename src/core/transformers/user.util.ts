import { User } from '../../user/user.entity';
import { UserInput } from '../../user/user.input';

declare module '../../user/user.entity' {
  export interface User {
    toModel: (input: User) => UserInput;
  }
}

User.prototype.toModel = (userEntity: User): UserInput => {
  const model = {} as UserInput;
  model.id = userEntity.id;
  model.Password = userEntity.password;
  model.Email = userEntity.email;
  model.FirstName = userEntity.firstName;
  model.LastName = userEntity.lastName;
  model.LastLogin = userEntity.lastLogin;

  return model;
};

declare module '../../user/user.input' {
  export interface UserInput {
    toEntity: (input: UserInput) => User;
  }
}

UserInput.prototype.toEntity = (input: UserInput): User => {
  const entity = {} as User;
  entity.id = input.id === null ? -1 : input.id;
  entity.email = input.Email;
  entity.firstName = input.FirstName;
  entity.lastName = input.LastName;
  entity.password = input.Password;

  return entity;
};
