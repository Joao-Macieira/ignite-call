import { Button, TextInput } from '@ignite-ui/react';
import * as S from './styles';
import { ArrowRight } from 'phosphor-react';

export function ClaimUsernameForm() {
  return (
    <S.Form as="form">
      <TextInput size="sm" prefix="ignite.com/" placeholder="seu-usuário" />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </S.Form>
  );
}
