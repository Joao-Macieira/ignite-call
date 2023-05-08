import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react';

import * as S from './styles';
import { Container, Header } from '../styles';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api';
import { api } from '@/lib/axios';
import { useRouter } from 'next/router';

const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProdileData = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProdileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const session = useSession();
  const router = useRouter();

  async function handleUpdateProfile(data: UpdateProdileData) {
    await api.put('/users/profile', { bio: data.bio });

    await router.push(`/schedule/${session.data?.user.username}`);
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Defina sua disponibilidade</Heading>
        <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <S.ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text>Foto de perfil</Text>
          <Avatar
            src={session.data?.user.avatar_url}
            alt={session.data?.user.name}
          />
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register('bio')} />
          <S.FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </S.FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar <ArrowRight />
        </Button>
      </S.ProfileBox>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  );

  return {
    props: {
      session,
    },
  };
};
