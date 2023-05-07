import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react';

import { Container, Header } from '../styles';
import * as S from './styles';
import { ArrowRight } from 'phosphor-react';

export default function TimeIntervals() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <S.IntervalBox as="form">
        <S.IntervalsContainer>
          <S.IntervalItem>
            <S.IntervalDay>
              <Checkbox />
              <Text>Segunda-feria</Text>
            </S.IntervalDay>

            <S.IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
              <TextInput size="sm" type="time" step={60} />
            </S.IntervalInputs>
          </S.IntervalItem>
          <S.IntervalItem>
            <S.IntervalDay>
              <Checkbox />
              <Text>Terça-feria</Text>
            </S.IntervalDay>

            <S.IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
              <TextInput size="sm" type="time" step={60} />
            </S.IntervalInputs>
          </S.IntervalItem>
        </S.IntervalsContainer>

        <Button type="submit">
          Próximo passo <ArrowRight />
        </Button>
      </S.IntervalBox>
    </Container>
  );
}
