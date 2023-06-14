import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	let expired = false;
	const {
		query: { id },
	} = req;
	const chat = await client.chat.findUnique({
		where: {
			id: Number(id),
		},
		include: {
			messages: {
				select: {
					id: true,
					message: true,
					user: {
						select: { avatar: true, id: true },
					},
				},
			},
			buyer: {
				select: { name: true, avatar: true },
			},
			product: {
				select: {
					image: true,
					name: true,
					price: true,
					user: {
						select: { name: true, avatar: true },
					},
				},
			},
			// 	user: {
			// 		select: { id: true, name: true, avatar: true },
			// 	},
			// 	messages: {
			// 		select: {
			// 			id: true,
			// 			user: {
			// 				select: {
			// 					id: true,
			// 					name: true,
			// 					avatar: true,
			// 				},
			// 			},
			// 		},
			// 		take: 10,
			// 		skip: 10,
			// 	},
		},
	});
	if (chat?.appointment) {
		if (new Date() > new Date(chat?.appointment)) {
			await client.chat.update({
				where: { id: chat.id },
				data: { appointment: null },
			});
			expired = true;
			chat.appointment = null;
		}
	}

	res.json({ ok: true, chat, expired });
};

export default withApiSession(withHandler({ methods: ['GET', 'POST'], handler }));
