import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { ArrowRight, Check } from 'phosphor-react';
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react';

import { Container, Header } from '../styles';
import * as S from './styles';
import { NextSeo } from 'next-seo';

export default function ConnectCalendar() {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = useMemo(
    () => !!router.query.error,
    [router.query.error],
  );

  const isSignedIn = useMemo(
    () => session.status === 'authenticated',
    [session],
  );

  async function handleConnectCalendar() {
    await signIn('google');
  }

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals');
  }

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <S.ConnectBox>
          <S.ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedIn ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={handleConnectCalendar}
              >
                Conectar <ArrowRight />
              </Button>
            )}
          </S.ConnectItem>

          {hasAuthError && (
            <S.AuthErroStyled size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar.
            </S.AuthErroStyled>
          )}

          <Button
            onClick={handleNavigateToNextStep}
            type="submit"
            disabled={!isSignedIn}
          >
            Próximo passo <ArrowRight />
          </Button>
        </S.ConnectBox>
      </Container>
    </>
  );
}
