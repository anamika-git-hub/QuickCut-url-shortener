import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as UserEntity } from '../../common/interfaces/entities/user.entity';
import { User, UserDocument } from '../schemas/user.schema';
import { IRepository } from '../../common/interfaces/repository.interface';

@Injectable()
export class UsersRepository implements IRepository<UserEntity> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.mapToEntity(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.mapToEntity(user) : null;
  }

  async create(createUserData: Partial<UserEntity>): Promise<UserEntity> {
    const createdUser = new this.userModel(createUserData);
    const savedUser = await createdUser.save();
    return this.mapToEntity(savedUser);
  }

  async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
    return updatedUser ? this.mapToEntity(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  private mapToEntity(document: UserDocument): UserEntity {
    const user = document.toObject();
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}