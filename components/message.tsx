import Image from 'next/image';
import { cls } from '../libs/client/utils';

interface MessageProps {
	message: string;
	reversed?: boolean;
	avatarUrl?: string;
}

export default function Message({ message, avatarUrl, reversed }: MessageProps) {
	return (
		<div className={cls('flex  items-start', reversed ? 'flex-row-reverse space-x-reverse' : 'space-x-2')}>
			{avatarUrl ? (
				<Image
					width={32}
					height={32}
					alt={'user'}
					src={`https://imagedelivery.net/MXAStR-weANHOBbpFYeX3Q/${avatarUrl}/avatar`}
					className="w-8 h-8 rounded-full bg-slate-300"
				/>
			) : (
				<div className="w-8 h-8 rounded-full bg-slate-400" />
			)}
			<div
				className={` p-2 px-3 text-sm text-gray-700 border ${
					reversed ? 'border-teal-300 mx-2 text-right' : 'border-gray-300'
				} rounded-md`}
			>
				<p>{message}</p>
			</div>
		</div>
	);
}
