import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmEntity, ScheduleEntity } from '../films/entities/films.entities';

import { Repository } from 'typeorm';

export interface FilmSchedule {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface Film {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: FilmSchedule[];
}

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<Film[]> {
    const films = await this.filmRepository.find({
      relations: ['schedule'],
    });
    return films.map((film) => this.mapToFilm(film));
  }

  async findById(id: string): Promise<Film | undefined> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film ? this.mapToFilm(film) : undefined;
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });

    if (schedule) {
      let takenArray: string[];
      if (Array.isArray(schedule.taken)) {
        takenArray = schedule.taken;
      } else if (typeof schedule.taken === 'string') {
        takenArray = schedule.taken.split(',').filter(Boolean);
      } else {
        takenArray = [];
      }

      if (!takenArray.includes(seatKey)) {
        takenArray.push(seatKey);
        schedule.taken = takenArray.join(',');
        await this.scheduleRepository.save(schedule);
      }
    }
  }

  private mapToFilm(entity: FilmEntity): Film {
    const processTags = (tags: any): string[] => {
      if (Array.isArray(tags)) {
        return tags.map((tag) => tag.trim());
      } else if (typeof tags === 'string') {
        return tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
      return [];
    };

    const processTaken = (taken: any): string[] => {
      if (Array.isArray(taken)) {
        return taken;
      } else if (typeof taken === 'string') {
        return taken.split(',').filter(Boolean);
      }
      return [];
    };

    return {
      id: entity.id,
      rating: entity.rating,
      director: entity.director,
      tags: processTags(entity.tags),
      image: entity.image,
      cover: entity.cover,
      title: entity.title,
      about: entity.about,
      description: entity.description,
      schedule: entity.schedule
        ? entity.schedule.map((s) => ({
            id: s.id,
            daytime: s.daytime,
            hall: s.hall,
            rows: s.rows,
            seats: s.seats,
            price: s.price,
            taken: processTaken(s.taken),
          }))
        : [],
    };
  }
}
