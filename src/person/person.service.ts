import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonEntity } from './entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly personRepository: Repository<PersonEntity>
  ) {}

  throwNotFoundError(text: string) {
    throw new NotFoundException(text);
  }
  
  async create(createPersonDto: CreatePersonDto) {
    
    try{
      const newPerson = {
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash: createPersonDto.password
      }

      this.personRepository.create(newPerson)
  
      const personCreated = await this.personRepository.save(newPerson)
  
      return {
        id: personCreated.id,
        name: personCreated.name,
        email: personCreated.email,
        passwordHash: personCreated.passwordHash,
        createdAt: personCreated.createdAt
      };
    } catch(error) {
      if(error.code === '23505') {
        throw new ConflictException('This email is already registered!')
      }

      throw error;
    }
  }

  async findAll(paginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const result = await this.personRepository.find({
      take: limit,
      skip: offset
    });

    // return {
    //   dataset: result.map<PersonEntity>(result => ({
    //     id: result.id,
    //     name: result.name,
    //     email: result.email,
    //     createdAt: result.createdAt
    //   })),
    //   limit,
    //   offset
    // }

    return result;
  }

  async findOne(id: string) {
    const getPerson = await this.personRepository.findOne({
      where: {
        id
      }
    })

    if(!getPerson) {
      this.throwNotFoundError('User not found!');
    };

    return getPerson;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const personExists = await this.personRepository.findOneBy({
      id
    });

    if(personExists) {
      const updatePerson = await this.personRepository.preload({
        id,
        name: updatePersonDto?.name,
        email: updatePersonDto?.email,
        passwordHash: updatePersonDto?.password
      })
      
      const updatedPerson = await this.personRepository.save(updatePerson)
  
      return {
        id,
        name: updatedPerson.name,
        email: updatedPerson.email,
        passworHash: updatedPerson.passwordHash,
        createdAt: updatedPerson.createdAt,
        updatedAt: updatedPerson.updatedAt
      }
    } else {
      this.throwNotFoundError('Person does not exists!')
    }

  }

  async remove(id: string) {
    const personExists = await this.personRepository.findOneBy({
      id
    });

    if(personExists) {
      await this.personRepository.remove(personExists);
      return {
        status: 'success',
        message: 'The usar has been deleted!'
      }
    } else {
      return this.throwNotFoundError('User not found!')
    }
  }
}
