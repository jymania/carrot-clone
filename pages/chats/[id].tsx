import type { NextPage } from 'next';
import Layout from '../../components/layout';
import Message from '../../components/message';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Chat, ChatMessage, User } from '@prisma/client';
import useUser from '@/libs/client/useUser';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/modal';
import { cls } from '@/libs/client/utils';

interface ChatMessageWithUser extends ChatMessage {
	user: User;
}
interface ChatMessageForm {
	chatMessage: string;
}

interface ChatWithMessages extends Chat {
	messages: ChatMessageWithUser[];
	buyer: { name: string; avatar?: string };
	product: { image?: string; name: string; price: number; user: { name: string; avatar: string; id: number } };
}
interface ChatResponse {
	ok: boolean;
	chat: ChatWithMessages;
	expired: boolean;
}

interface AppointmentForm {
	datetime: string;
}
const ChatDetail: NextPage = props => {
	const { user } = useUser();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { register, handleSubmit, reset, setError } = useForm<ChatMessageForm>();
	const { data, isLoading, mutate, error } = useSWR<ChatResponse>(
		router.query.id ? `/api/chats/${router.query.id}` : null,
		{
			refreshInterval: 1000,
		},
	);
	useEffect(() => {
		if (data?.expired) alert('Your appointment is Expired.');
		setDate(data?.chat.appointment || '');
	}, [data]);
	const [date, setDate] = useState<string>(data?.chat.appointment || '');

	const { register: appointmentRegister, handleSubmit: appointmentSubmit, getValues } = useForm<AppointmentForm>();
	const [setAppointment, { loading: appointmentLoading, data: chatData }] = useMutation(
		`/api/chats/${router.query.id}/appointment`,
	);
	const onAppointmentCancel = () => {
		if (appointmentLoading) return;
		mutate(
			prev =>
				prev && {
					...prev,
					chat: {
						...prev.chat,
						appointment: null,
					},
				},
		);
		setAppointment({ datetime: null });
		alert(`U have cancel the appointment`);
	};
	const onAppointmentValid = (form: AppointmentForm) => {
		if (appointmentLoading) return;
		if (form.datetime === '') return;
		mutate(
			prev =>
				prev && {
					...prev,
					chat: {
						...prev.chat,
						appointment: form.datetime === '' ? null : form.datetime,
					},
				},
		);
		setAppointment(form);
		alert(`U have make appointment to ${data?.chat.buyer.name}`);
		setIsOpen(false);
	};
	const [sendMessage, { loading, data: sendMessageData }] = useMutation(`/api/chats/${router.query.id}/messages`);

	const onValid = (form: ChatMessageForm) => {
		if (loading) return;
		reset();
		mutate(
			prev =>
				prev &&
				({
					...prev,
					chat: {
						...prev.chat,
						messages: [...prev.chat.messages, { id: Date.now(), message: form.chatMessage, user: { ...user } }],
					},
				} as any),
			false,
		);
		sendMessage(form);
	};
	const appointmentBody = (
		<div className="flex flex-col justify-center text-center">
			<form>
				<input
					className="block p-4 text-lg rounded-md"
					type="datetime-local"
					value={date}
					{...appointmentRegister('datetime', { required: true })}
					onChange={e => {
						// check valid datetime
						setDate(e.target.value);
					}}
				/>
			</form>
		</div>
	);

	const openModal = () => (data?.chat.buyerId === user?.id ? null : setIsOpen(true));
	useEffect(() => {
		if (sendMessageData && sendMessageData.ok) {
			scrollRef?.current?.scrollIntoView();
		}
	}, [sendMessageData, mutate]);
	return (
		<Layout canGoBack title={'Now talking with ' + data?.chat.product.user.name ?? 'Loading...'}>
			<Modal
				actionLabel="Make appiontment"
				onSubmit={appointmentSubmit(onAppointmentValid)}
				secondaryAction={appointmentSubmit(onAppointmentCancel)}
				secondaryActionLabel="Cancel Appointment"
				body={appointmentBody}
				title="Make appointment"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
			<div className="px-4">
				<div className="flex flex-row justify-between">
					<div className="flex flex-row items-center">
						{data?.chat.product.image ? (
							<Image
								alt={data.chat.product.name}
								src={`https://imagedelivery.net/MXAStR-weANHOBbpFYeX3Q/${data?.chat.product.image}/avatar`}
								width={48}
								height={48}
								className="m-4 rounded-sm ring-1 ring-offset-2 ring-red-500"
							/>
						) : null}
						<div className="flex flex-col">
							<div className="text-md">{data?.chat.product.name}</div>
							<div className="text-sm">&#x20A9; {data?.chat.product.price.toLocaleString()}</div>
						</div>
					</div>
					<button
						className={cls(
							'items-center p-4 ',
							data?.chat.appointment || getValues('datetime') ? 'text-amber-600' : '',
						)}
						onClick={openModal}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-10 h-10"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
							/>
						</svg>
					</button>
				</div>
				{data?.chat.appointment ? (
					<div className="flex flex-row items-center justify-end gap-2 text-right">
						We meet at
						<span>
							{data?.chat.appointment.split('T').map(text => (
								<div key="text">{text}</div>
							))}
						</span>
					</div>
				) : null}
			</div>
			<hr />
			<div className="px-4 py-10 pb-16 space-y-4">
				<>
					{!isLoading &&
						data &&
						data.ok &&
						data.chat?.messages.map(message => (
							<Message
								avatarUrl={message.user.avatar ?? undefined}
								key={message.id}
								message={message.message}
								reversed={user?.id === message.user.id}
							/>
						))}
				</>
				<form onSubmit={handleSubmit(onValid)} className="fixed inset-x-0 bottom-0 py-2 bg-white">
					<div className="relative flex items-center w-full max-w-md mx-auto">
						<input
							{...register('chatMessage', { required: true })}
							type="text"
							className="w-full pr-12 border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:outline-none focus:border-orange-500"
						/>
						<div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
							<button className="flex items-center px-3 text-sm text-white bg-orange-500 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:bg-orange-600">
								&rarr;
							</button>
						</div>
					</div>
				</form>
			</div>
		</Layout>
	);
};

export default ChatDetail;
