import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		session: { user },
	} = req;
	if (req.method === 'GET') {
		const chats = await client.chat.findMany({
			where: {
				OR: [{ buyerId: user?.id }, { product: { userId: user?.id } }],
			},
			include: {
				messages: {
					take: 1,
					orderBy: { createdAt: 'desc' },
					include: {
						user: {
							select: {
								avatar: true,
								name: true,
							},
						},
					},
				},
			},
		});
		res.json({ ok: true, chats });
	}
	if (req.method === 'POST') {
		const {
			body: { productId },
		} = req;
		const existChat = await client.chat.findFirst({
			where: {
				AND: [{ buyerId: user?.id }, { productId: Number(productId) }],
			},
		});
		if (existChat) res.json({ ok: true, chat: existChat });
		else {
			const chat = await client.chat.create({
				data: {
					product: { connect: { id: +productId } },
					buyer: { connect: { id: user?.id } },
				},
			});
			res.json({ ok: true, chat });
		}
	}
	res.json({ ok: false });
};

export default withApiSession(withHandler({ methods: ['GET', 'POST'], handler }));
