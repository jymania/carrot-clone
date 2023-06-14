import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		query: { id },
		body,
		session: { user },
	} = req;

	const message = await client.chatMessage.create({
		data: {
			message: body.chatMessage,
			chat: {
				connect: { id: Number(id) },
			},
			user: {
				connect: {
					id: user?.id,
				},
			},
		},
	});
	res.json({ ok: true, message });
};

export default withApiSession(withHandler({ methods: ['POST'], handler }));
