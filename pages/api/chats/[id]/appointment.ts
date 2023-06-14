import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		query: { id },
	} = req;
	const existChat = await client.chat.findUnique({
		where: {
			id: Number(id),
		},
	});
	if (!existChat) {
		res.status(400).json({ ok: false });
	} else {
		const {
			body: { datetime },
		} = req;

		const chat = await client.chat.update({
			where: { id: Number(id) },
			data: {
				appointment: datetime,
			},
		});
		res.json({ ok: true, chat });
	}
};

export default withApiSession(withHandler({ methods: ['GET', 'POST'], handler }));
