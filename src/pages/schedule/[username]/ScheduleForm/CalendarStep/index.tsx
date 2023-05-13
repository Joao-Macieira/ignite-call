import { useEffect, useState } from 'react';

import { Calendar } from '@/components/Calendar';
import * as S from './styles';
import dayjs from 'dayjs';
import { api } from '@/lib/axios';
import { useRouter } from 'next/router';

interface Availability {
  possiblesTimes: number[];
  availablesTimes: number[];
}

export function CalendarStep() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);

  const username = String(router.query.username);

  const isDateSelected = !!selectedDate;

  const weekDay = selectedDate && dayjs(selectedDate).format('dddd');
  const describedDate =
    selectedDate && dayjs(selectedDate).format('DD[ de ]MMMM');

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    api
      .get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      })
      .then((response) => {
        console.log({ data: response.data });
        setAvailability(response.data);
      });
  }, [selectedDate, username]);

  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            {availability?.possiblesTimes.map((hour) => (
              <S.TimePickerItem
                key={hour}
                disabled={!availability?.availablesTimes?.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </S.TimePickerItem>
            ))}
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  );
}
