import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	if (req.method === 'GET') {
		const profile = await client.user.findUnique({
			where: {
				id: req.session.user?.id,
			},
		});
		res.json({ ok: true, profile });
	}
	if (req.method === 'POST') {
		const {
			session: { user },
			body: { email, phone, name, avatarId },
		} = req;
		const currentUser = await client.user.findUnique({
			where: { id: user?.id },
		});
		if (email && email !== currentUser?.email) {
			const existUser = Boolean(
				await client.user.findUnique({
					where: {
						email,
					},
				}),
			);
			if (existUser) {
				return res.json({
					ok: false,
					error: 'Email already exists',
				});
			}
			await client.user.update({
				where: {
					id: user?.id,
				},
				data: {
					email,
				},
			});
		}
		if (phone && phone !== currentUser?.phone) {
			const existUser = Boolean(
				await client.user.findUnique({
					where: {
						phone,
					},
				}),
			);
			if (existUser) {
				return res.json({
					ok: false,
					error: 'Phone already exists',
				});
			}
			await client.user.update({
				where: {
					id: user?.id,
				},
				data: {
					phone,
				},
			});
		}

		if (name) {
			await client.user.update({
				where: {
					id: user?.id,
				},
				data: {
					name,
				},
			});
		}
		if (avatarId) {
			await client.user.update({
				where: {
					id: user?.id,
				},
				data: {
					avatar: avatarId,
				},
			});
		}
		res.json({ ok: true });
	}
};
export default withApiSession(withHandler({ methods: ['GET', 'POST'], handler }));
