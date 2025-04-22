import {Injectable, ConflictException, NotFoundException} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User,UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findByEmail(email: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email }).exec();
        return user;
      }

    async findById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id).exec();
        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const {email, password} = createUserDto;

        const existingUser = await this.findByEmail(email);
        if(existingUser) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        
        return newUser.save();
    }
}
