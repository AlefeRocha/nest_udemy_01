import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UniqueIDEntity } from 'src/tools/unique.id.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepositoru: Repository<MessageEntity>,
  ) {}
  private messages: MessageEntity[] = [];

  throwNotFoundError(text: string) {
    throw new NotFoundException(text);
  }

  async findAll() {
    return await this.messageRepositoru.find();
  }

  async findOne(id: string) {
    const message = await this.messageRepositoru.findOne({
      where: {
        id,
      },
    });

    if (message) return message;

    this.throwNotFoundError('Message not found!');
  }

  create(createMessageDto: CreateMessageDto) {
    const newMessage = {
      id: new UniqueIDEntity().toString(),
      ...createMessageDto,
      read: false,
      createdAt: new Date(),
    };

    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    const messageExists = this.messages.findIndex((item) => item.id === id);

    if (messageExists < 0) {
      this.throwNotFoundError('Message not found!');
    }

    const messageReplace = this.messages[messageExists];

    this.messages[messageExists] = {
      ...messageReplace,
      ...updateMessageDto,
      updatedAt: new Date(),
    };

    return this.messages[messageExists];
  }

  remove(id: string) {
    const messageExists = this.messages.findIndex((item) => item.id === id);

    if (messageExists < 0) {
      this.throwNotFoundError('Message not found!');
    }

    const message = this.messages[messageExists];

    this.messages.splice(messageExists, 1);

    return {
      about: `The message id ${id}, was deleted!`,
      message: message,
    };
  }
}
