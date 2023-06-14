import { useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';

interface LoginForm {
	username: string;
	password: string;
	email: string;
}
const Forms = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		// mode: 'onBlur',
	});

	const onValid = (data: LoginForm) => {
		console.log(data);
	};
	const onInvalid = (errors: FieldErrors) => {
		console.log(errors);
	};

	return (
		<form onSubmit={handleSubmit(onValid, onInvalid)}>
			<input
				{...register('username', {
					required: '이름 왜 안 적?',
					minLength: { message: '5 chars needs', value: 5 },
				})}
				type="text"
				placeholder="Username"
			/>
			<input
				{...register('email', {
					required: '이메일 쓰락!',
					validate: {
						notGmail: value => !value.includes('@gmail.com') || 'gmail?? oh...no...',
						notNaver: value => !value.includes('@naver.com'),
					},
				})}
				className={`
        ${Boolean(errors.email) ? 'border border-red-500' : ''}
        `}
				type="email"
				placeholder="Email"
			/>
			{errors.email && <div>{errors.email.message}</div>}
			<input
				{...register('password', {
					required: '피해갈 수 없',
				})}
				type="password"
				placeholder="Password"
			/>
			<input type="submit" value="create account" />
		</form>
	);
};
export default Forms;
