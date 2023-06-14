import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		query: { id },
		session: { user },
	} = req;
	const alreadyExist = await client.wondering.findFirst({
		where: {
			userId: user?.id,
			postId: Number(id),
		},
		select: {
			id: true, // id 만 필요함(to delete)
		},
	});
	if (alreadyExist) {
		await client.wondering.delete({
			where: {
				id: alreadyExist.id,
			},
		});
	} else {
		await client.wondering.create({
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
			},
		});
	}
	res.json({ ok: true });
};

export default withApiSession(withHandler({ methods: ['POST'], handler }));
