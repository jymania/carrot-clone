import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	if (req.method === 'GET') {
		const products = await client.product.findMany({
			include: {
				_count: {
					select: {
						favs: true,
					},
				},
			},
		});
		res.json({ ok: true, products });
	}
	if (req.method === 'POST') {
		const {
			body: { name, price, description, photoId },
			session: { user },
		} = req;
		const product = await client.product.create({
			data: {
				name,
				price: +price,
				description,
				image: photoId,
				user: {
					connect: { id: user?.id },
				},
			},
		});
		res.json({ ok: true, product });
	}
};

export default withApiSession(withHandler({ methods: ['POST', 'GET'], handler }));
