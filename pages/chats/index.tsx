import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout';
import useSWR from 'swr';
import { Chat, ChatMessage, User } from '@prisma/client';
import Image from 'next/image';

interface MessagesWithUser extends ChatMessage {
	user: { avatar: string; name: string };
}
interface ChatWithMessages extends Chat {
	messages: MessagesWithUser[];
}
interface ChatListResponse {
	ok: boolean;
	chats: ChatWithMessages[];
}
const Chats: NextPage = props => {
	const { data } = useSWR<ChatListResponse>('/api/chats');
	return (
		<Layout hasTabBar title="채팅">
			<div className="divide-y-[1px] ">
				{data &&
					data.ok &&
					data.chats.map(chat => (
						<Link
							className="flex items-center px-4 py-3 space-x-3 cursor-pointer"
							href={`/chats/${chat.id}`}
							key={chat.id}
						>
							{chat.messages[0].user ? (
								<Image
									alt={chat.messages[0].user.name}
									src={`https://imagedelivery.net/MXAStR-weANHOBbpFYeX3Q/${chat.messages[0].user.avatar}/avatar`}
									width={48}
									height={48}
									className="w-12 h-12 rounded-full bg-slate-300"
								/>
							) : (
								<div className="w-12 h-12 rounded-full bg-slate-300" />
							)}
							<div>
								<p className="text-gray-700">{chat.messages[0].user && chat.messages[0].user.name}</p>
								<p className="text-sm text-gray-500">{chat.messages[0].message}</p>
							</div>
						</Link>
					))}
			</div>
		</Layout>
	);
};

export default Chats;
