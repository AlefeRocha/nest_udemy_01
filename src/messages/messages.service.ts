import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}
  private messages: MessageEntity[] = [];

  throwNotFoundError(text: string) {
    throw new NotFoundException(text);
  }

  async findAll() {
    return await this.messageRepository.find();
  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    if (!message) {
      this.throwNotFoundError('Message not found!');
    }

    return message;
  }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = this.messageRepository.create({
      ...createMessageDto,
      read: false,
      createdAt: new Date(),
    });
    
    const messageSaved = await this.messageRepository.save(newMessage);

    return {
      id: messageSaved.id,
      text: messageSaved.text,
      by: messageSaved.by,
      to: messageSaved.to,
      read: messageSaved.read,
      createdAt: messageSaved.createdAt
    };
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    // Ajustar o DTO de updated para permitir apenas "read" e "text" como alteraveis
    const messageExists = await this.messageRepository.preload({
      id,
      ...updateMessageDto,
      updatedAt: new Date()
    });

    if (!messageExists) {
      this.throwNotFoundError('Message not found!');
    }

    const messageUpdated = await this.messageRepository.save(messageExists)

    return {
      id: id,
      text: messageUpdated.text,
      by: messageUpdated.by,
      to: messageUpdated.to,
      read: messageUpdated.read,
      createdAt: messageUpdated.createdAt,
      updatedAt: messageUpdated.updatedAt
    }
  }

  async remove(id: string) {
    const messageExists = await this.messageRepository.findOneBy({
      id
    });

    if(!messageExists) {
      this.throwNotFoundError('Message not found')
    };

    await this.messageRepository.remove(messageExists);

    return {
      about: `The message id ${id}, was deleted!`,
      message: messageExists,
    };
  }
}
