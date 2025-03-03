import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly personService: PersonService,
  ) {}

  throwNotFoundError(text: string) {
    throw new NotFoundException(text);
  }

  async findAll(paginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    
    return await this.messageRepository.find({
      take: limit,
      skip: offset,
      relations: ["by", "to"],
      select: {
        by: {
          id: true,
          name: true
        },
        to: {
          id: true,
          name: true
        }
      }
    });
  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
      relations: ["by", "to"],
      select: {
        by: {
          id: true,
          name: true
        },
        to: {
          id: true,
          name: true
        }
      }
    });

    if (!message) {
      this.throwNotFoundError('Message not found!');
    }

    return message;
  }

  async create(createMessageDto: CreateMessageDto) {
    const { byId, toId } = createMessageDto;

    const by = await this.personService.findOne(byId)

    const to = await this.personService.findOne(toId)

    const newMessage = this.messageRepository.create({
      text: createMessageDto.text,
      by,
      to,
      read: false,
      createdAt: new Date(),
    });

    const messageSaved = await this.messageRepository.save(newMessage);

    return {
      id: messageSaved.id,
      text: messageSaved.text,
      by: {
        id: messageSaved.by.id,
        name: messageSaved.by.name
      },
      to: {
        id: messageSaved.by.id,
        name: messageSaved.to.name
      },
      read: messageSaved.read,
      createdAt: messageSaved.createdAt
    };
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);

    if(message.read === true && updateMessageDto.text) {
      throw new BadRequestException('You cannot change the message once it has been read!')
    }

    if(updateMessageDto.read === true && updateMessageDto.text) {
      throw new ConflictException("You cannot modify the 'text' and 'read' properties at the same time!")
    }

    message.text = updateMessageDto?.text ?? message.text
    message.read = updateMessageDto?.read ?? message.read

    const messageUpdated = await this.messageRepository.save(message)

    return {
      id: id,
      text: messageUpdated.text,
      by: {
        id: messageUpdated.by.id,
        name: messageUpdated.by.name
      },
      to: {
        id: messageUpdated.to.id,
        name: messageUpdated.to.name
      },
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
      status: 'success',
      about: `The message id ${id}, was deleted!`,
      message: messageExists,
    };
  }
}
