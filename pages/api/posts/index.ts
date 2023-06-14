import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		body: { question, latitude, longitude },
		session: { user },
	} = req;

	if (req.method === 'POST') {
		const post = await client.post.create({
			data: {
				question,
				latitude,
				longitude,
				user: {
					connect: {
						id: user?.id,
					},
				},
			},
		});
		res.json({ ok: true, post });
	}
	if (req.method === 'GET') {
		const {
			query: { latitude, longitude },
		} = req;
		const parsedLatitude = latitude && parseFloat(latitude.toString());
		const parsedLongitude = longitude && parseFloat(longitude.toString());
		const posts = await client.post.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatar: true,
					},
				},
				_count: {
					select: {
						wondering: true,
						answers: true,
					},
				},
			},
			where: {
				latitude: { gte: Number(parsedLatitude) - 0.01, lte: Number(parsedLatitude) + 0.01 },
				longitude: { gte: Number(parsedLongitude) - 0.01, lte: Number(parsedLongitude) + 0.01 },
			},
		});
		res.json({ ok: true, posts });
	}
};

export default withApiSession(withHandler({ methods: ['GET', 'POST'], handler }));
