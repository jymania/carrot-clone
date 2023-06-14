import type { NextPage } from 'next';
import Button from '../../components/button';
import Input from '../../components/input';
import Layout from '../../components/layout';
import TextArea from '../../components/textarea';
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stream } from '@prisma/client';

interface CreateForm {
	name: string;
	price: string;
	description: string;
}

interface CreateResponse {
	ok: boolean;
	stream: Stream;
}
const Create: NextPage = () => {
	const router = useRouter();
	const [createStream, { loading, data }] = useMutation<CreateResponse>(`/api/streams`);
	const { register, handleSubmit } = useForm<CreateForm>();
	const onValid = (form: CreateForm) => {
		if (loading) return;
		createStream(form);
	};
	useEffect(() => {
		if (data && data.ok) {
			router.push(`/streams/${data.stream.id}`);
		}
	}, [data, router]);
	return (
		<Layout canGoBack title="Go Live">
			<form onSubmit={handleSubmit(onValid)} className="px-4 py-10 space-y-4 ">
				<Input register={register('name', { required: true })} required label="Name" name="name" type="text" />
				<Input
					register={register('price', { required: true, valueAsNumber: true /* 이 값을 숫자로 넘겨줘 */ })}
					required
					label="Price"
					name="price"
					type="text"
					kind="price"
				/>
				<TextArea register={register('description', { required: true })} name="description" label="Description" />
				<Button text={loading ? 'Loading...' : 'Go live'} />
			</form>
		</Layout>
	);
};

export default Create;
