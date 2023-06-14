import type { NextPage } from 'next';
import Button from '../../components/button';
import Input from '../../components/input';
import Layout from '../../components/layout';
import useUser from '@/libs/client/useUser';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useMutation from '@/libs/client/useMutation';
import Image from 'next/image';

interface EditProfileForm {
	email?: string;
	phone?: string;
	name?: string;
	avatar?: FileList;
	formErrors?: string;
}

interface EditProfileResponse {
	ok: boolean;
	error?: string;
}
const EditProfile: NextPage = () => {
	const { user } = useUser();
	const {
		register,
		setValue,
		setError,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<EditProfileForm>();
	useEffect(() => {
		if (user?.email) setValue('email', user.email);
		if (user?.phone) setValue('phone', user.phone);
		if (user?.name) setValue('name', user.name);
		if (user?.avatar) setAvatarPreview(`https://imagedelivery.net/MXAStR-weANHOBbpFYeX3Q/${user.avatar}/avatar`);
	}, [user, setValue]);
	const [editProfile, { data, loading }] = useMutation<EditProfileResponse>(`/api/users/me`);
	const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
		if (loading) return;
		if (email === '' && phone === '' && name === '') {
			return setError('formErrors', { message: 'Email or Phone number are required.' });
		}
		if (avatar && avatar.length > 0 && user) {
			// ask CF URL
			const { uploadURL } = await (await fetch(`/api/files`)).json();

			// upload file to CF
			const form = new FormData();
			form.append('file', avatar[0], user?.id + '');
			const {
				result: { id },
			} = await (
				await fetch(uploadURL, {
					method: 'POST',
					body: form,
				})
			).json();
			editProfile({
				email,
				phone,
				name,
				avatarId: id,
			});
		} else {
			editProfile({ email, phone, name });
		}
	};
	useEffect(() => {
		if (data && !data.ok && data.error) {
			setError('formErrors', { message: data.error });
		}
	}, [data, setError]);
	const [avatarPreview, setAvatarPreview] = useState('');
	const avatar = watch('avatar');

	useEffect(() => {
		if (avatar && avatar.length > 0) {
			const file = avatar[0];
			setAvatarPreview(URL.createObjectURL(file));
		}
	}, [avatar]);

	return (
		<Layout canGoBack title="Edit Profile">
			<form onSubmit={handleSubmit(onValid)} className="px-4 py-10 space-y-4">
				<div className="flex items-center space-x-3">
					{avatarPreview ? (
						<Image alt="avatar" src={avatarPreview} className="rounded-full w-14 h-14 bg-slate-500" />
					) : (
						<div className="rounded-full w-14 h-14 bg-slate-500" />
					)}
					<label
						htmlFor="picture"
						className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
					>
						Change
						<input {...register('avatar')} id="picture" type="file" className="hidden" accept="image/*" />
					</label>
				</div>
				<Input register={register('name')} required={false} label="Name" name="name" type="text" />
				<Input register={register('email')} required={false} label="Email address" name="email" type="email" />
				<Input
					register={register('phone')}
					required={false}
					label="Phone number"
					name="phone"
					type="number"
					kind="phone"
				/>
				{errors.formErrors ? (
					<span className="block my-2 font-medium text-center text-red-500">{errors.formErrors.message}</span>
				) : null}
				<Button text={loading ? 'Loading...' : 'Update profile'} />
			</form>
		</Layout>
	);
};

export default EditProfile;
