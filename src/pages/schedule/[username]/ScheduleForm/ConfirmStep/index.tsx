import { Button, Text, TextArea, TextInput } from '@ignite-ui/react';
import * as S from './styles';
import { CalendarBlank, Clock } from 'phosphor-react';

export function ConfirmStep() {
  function handleConfirmScheduling() {}
  return (
    <S.ConfirmForm as="form" onSubmit={handleConfirmScheduling}>
      <S.FormHeader>
        <Text>
          <CalendarBlank />
          22 de Setembro de 2022
        </Text>

        <Text>
          <Clock />
          18:00h
        </Text>
      </S.FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" />
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput type="email" placeholder="johndor@email.com" />
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea />
      </label>

      <S.FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit">Confirmar</Button>
      </S.FormActions>
    </S.ConfirmForm>
  );
}
