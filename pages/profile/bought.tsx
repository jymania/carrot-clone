import type { NextPage } from 'next';
import Item from '../../components/item';
import Layout from '../../components/layout';
import ProductList from '@/components/product-list';

const Bought: NextPage = () => {
	return (
		<Layout title="구매내역" canGoBack>
			<div className="flex flex-col pb-10 space-y-5 divide-y">
				<ProductList kind="purchases" />
			</div>
		</Layout>
	);
};

export default Bought;
