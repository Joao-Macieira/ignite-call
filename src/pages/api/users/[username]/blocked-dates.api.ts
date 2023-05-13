/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).end();
  }

  const username = String(request.query.username);
  const { year, month } = request.query;

  if (!year || !month) {
    return response
      .status(400)
      .json({ message: 'Year or month not specified.' });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return response.status(400).json({ message: 'User does not exists' });
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  });

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (weekDay) =>
      !availableWeekDays.some(
        (availableWeekDay) => availableWeekDay.week_day === weekDay,
      ),
  );

  const blockedDateRow: Array<{ date: number }> = await prisma.$queryRaw`
    select
      EXTRACT(DAY from S.date) as date,
      COUNT(S.date) as amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) as size
    from schedulings S
    left join user_time_intervals UTI
      on UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))
    where S.user_id = ${user.id}
      and DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
    group by EXTRACT(DAY from S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
    having amount >= size
  `;

  const blockedDates = blockedDateRow.map((item) => item.date);

  return response.json({ blockedWeekDays, blockedDates });
}
