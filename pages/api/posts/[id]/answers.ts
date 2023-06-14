import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		query: { id },
		session: { user },
		body: { answer },
	} = req;
	// const post = await client.post.findUnique({
	// 	where: {
	// 		id: Number(id),
	// 	},
	// 	select: { id: true },
	// });
	// if( !post ) res.status(400).json({ok:false})

	const newAnswer = await client.answer.create({
		data: {
			user: {
				connect: {
					id: user?.id,
				},
			},
			post: {
				connect: {
					id: Number(id),
				},
			},
			answer,
		},
	});

	res.json({ ok: true, answer: newAnswer /* redirect 해 줄 필요 없으므로 answer는 사실 필요 없음  just in case */ });
};

export default withApiSession(withHandler({ methods: ['POST'], handler }));
