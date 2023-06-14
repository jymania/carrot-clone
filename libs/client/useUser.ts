import { User } from '@prisma/client';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface ProfileResponse {
	ok: boolean;
	profile: User;
}
const useUser = (state: 'public' | null = null) => {
	const { data, error } = useSWR<ProfileResponse>('/api/users/me');
	// const router = useRouter();

	// useEffect(() => {
	// 	if (!state && data && !data.ok) router.replace('/enter');
	// }, [data, router, state]);
	return { user: data?.profile, isLoading: !data && !error };
};

export default useUser;
