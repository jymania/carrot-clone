import type { NextPage } from 'next';
import Button from '../../components/button';
import Layout from '../../components/layout';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';
import { Chat, Product, User } from '@prisma/client';
import useMutation from '@/libs/client/useMutation';
import { cls } from '@/libs/client/utils';
import useUser from '@/libs/client/useUser';
import Image from 'next/image';
import { useEffect } from 'react';

interface ProductWithUser extends Product {
	user: User;
}

interface ItemDetailResponse {
	ok: boolean;
	product: ProductWithUser;
	relatedProducts: Product[];
	isLiked: boolean;
}

interface CreateChatResponse {
	ok: boolean;
	chat: Chat;
}

const ItemDetail: NextPage = props => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	// const { mutate } = useSWRConfig();
	const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
		router.query.id ? `/api/products/${router.query.id}` : null,
	);
	const [createChat, { loading, data: chatData }] = useMutation<CreateChatResponse>('/api/chats');
	const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
	const onChatClick = () => {
		if (loading) return;
		confirm(`Are you really want to talk to ${data?.product.user.name}?`)
			? createChat({ productId: router.query.id })
			: undefined;
	};

	useEffect(() => {
		console.log(chatData);
		if (chatData && chatData.ok) router.push(`/chats/${chatData.chat.id}`);
	}, [chatData, router]);

	const onFavClick = () => {
		if (!data) return;
		boundMutate(prev => prev && { ...prev, isLiked: !prev.isLiked }, false); // mutate(data to replace , do revalidate)
		// mutate('/api/users/me', {ok:false}, false)
		toggleFav({});
	};
	// console.log(data);

	return (
		<Layout canGoBack>
			<div className="px-4 py-4">
				<div className="mb-8">
					<div className="relative pb-96 bg-slate-300">
						{data?.product.image ? (
							<Image
								alt={data?.product.name ?? 'product image'}
								src={`https://imagedelivery.net/MXAStR-weANHOBbpFYeX3Q/${data?.product.image}/public`}
								className="object-cover h-96 bg-slate-300"
								fill
							/>
						) : null}
					</div>
					<div className="flex items-center py-3 space-x-3 border-t border-b cursor-pointer">
						{data?.product?.user.avatar ? (
							<Image
								width={48}
								height={48}
								alt={data?.product.name}
								src={`https://imagedelivery.net/MXAStR-weANHOBbpFYeX3Q/${data?.product?.user.avatar}/avatar`}
								className="w-12 h-12 rounded-full bg-slate-300"
							/>
						) : (
							<div className="w-12 h-12 rounded-full bg-slate-300" />
						)}
						<div>
							<p className="text-sm font-medium text-gray-700">{data?.product?.user?.name}</p>
							<Link href={`/users/profiles/${data?.product?.user?.id}`} className="text-xs font-medium text-gray-500">
								View profile &rarr;
							</Link>
						</div>
					</div>
					<div className="mt-5">
						<h1 className="text-3xl font-bold text-gray-900">{data?.product?.name}</h1>
						<span className="block mt-3 text-2xl text-gray-900">&#x20A9; {data?.product?.price}</span>
						<p className="my-6 text-gray-700 ">{data?.product?.description}</p>
						{data?.product.user.id !== user?.id ? (
							<div className="flex items-center justify-between space-x-2">
								<Button onClick={onChatClick} large text="Talk to seller" />
								<button
									onClick={onFavClick}
									className={cls(
										'flex items-center justify-center p-3 rounded-md',
										data?.isLiked
											? 'text-red-400 hover:bg-red-100 hover:text-red-500'
											: 'text-gray-400 hover:bg-gray-100 hover:text-gray-500',
									)}
								>
									{data?.isLiked ? (
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
											<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
											/>
										</svg>
									)}
								</button>
							</div>
						) : null}
					</div>
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
					<div className="grid grid-cols-2 gap-4 mt-6 ">
						{data?.relatedProducts?.map(relatedProduct => (
							<div key={relatedProduct.id}>
								<div className="w-full h-56 mb-4 bg-slate-300" />
								<h3 className="-mb-1 text-gray-700">{relatedProduct.name}</h3>
								<span className="text-sm font-medium text-gray-900">&#x20A9; {relatedProduct.price}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default ItemDetail;
