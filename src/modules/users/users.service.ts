import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  sanitize(user: UserDocument) {
    const plain = user.toObject();
    delete plain.password;
    return plain;
  }

  async create(createUserDto: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    const savedUser = await createdUser.save();
    return this.sanitize(savedUser);
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let updateData: Partial<UpdateUserDto & { password: string }> = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData = {
        ...updateUserDto,
        password: await bcrypt.hash(updateUserDto.password, 10),
      };
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found.');
    }

    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).select('-password').exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found.');
    }
    return deletedUser;
  }

  async updatePasswordByEmail(email: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new UnauthorizedException("Ancien mot de passe incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return { message: "Mot de passe mis à jour avec succès" };
  }
}

