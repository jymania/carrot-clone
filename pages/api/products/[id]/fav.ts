import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		query: { id },
		session: { user },
	} = req;
	const alreadyExist = await client.fav.findFirst({
		where: {
			productId: Number(id),
			userId: user?.id,
		},
	});
	if (alreadyExist) {
		// delete
		await client.fav.delete({
			where: {
				id: alreadyExist.id,
			},
		});
	} else {
		// create
		await client.fav.create({
			data: {
				user: {
					connect: {
						id: user?.id,
					},
				},
				product: {
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
