/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).end();
  }

  const username = String(request.query.username);
  const { date } = request.query;

  if (!date) {
    return response.status(400).json({ message: 'Date not provided.' });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return response.status(400).json({ message: 'User does not exists' });
  }

  const referenceDate = dayjs(String(date));

  const isPastDate = referenceDate.endOf('day').isBefore(new Date());

  if (isPastDate) {
    return response.json({ possiblesTimes: [], availablesTimes: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  });

  if (!userAvailability) {
    return response.json({ possiblesTimes: [], availablesTimes: [] });
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possiblesTimes = Array.from({
    length: endHour - startHour,
  }).map((_, index) => startHour + index);

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  });

  const availablesTimes = possiblesTimes.filter(
    (time) =>
      !blockedTimes.some((blockedTime) => blockedTime.date.getHours() === time),
  );

  return response.json({ possiblesTimes, availablesTimes });
}
