"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import { UserResource } from "@clerk/types";
import {
	SESSION_ID_KEY,
	LOGOUT_FLAG_KEY,
} from "@/features/connection/constants";

interface UserInfo {
	id: string;
	clerkId: string;
	displayName?: string;
	zennUsername?: string;
	profileImage?: string;
	zennArticleCount: number;
}

interface UseSessionManagementProps {
	user: UserResource | null | undefined;
	isLoaded: boolean;
	setWasLoggedOut: Dispatch<SetStateAction<boolean>>;
	setIsNewSession: Dispatch<SetStateAction<boolean>>;
	setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
	setZennUsername: Dispatch<SetStateAction<string>>;
}

export const useSessionManagement = ({
	user,
	isLoaded,
	setWasLoggedOut,
	setIsNewSession,
	setUserInfo,
	setZennUsername,
}: UseSessionManagementProps) => {
	useEffect(() => {
		if (typeof window !== "undefined") {
			if (user) {
				// ユーザーがログインしている場合
				const currentSessionId = localStorage.getItem(SESSION_ID_KEY);
				const logoutFlag = localStorage.getItem(LOGOUT_FLAG_KEY);

				// ログアウトフラグがある場合またはセッションIDが変更された場合
				if (
					logoutFlag === "true" ||
					!currentSessionId ||
					currentSessionId !== user.id
				) {
					// フラグをクリア
					localStorage.removeItem(LOGOUT_FLAG_KEY);
					localStorage.removeItem("zenn_previous_user");
					localStorage.setItem(SESSION_ID_KEY, user.id);

					// DBのデータは保持するため、リセット処理は行わない
					// フラグのみ設定してuseUserInfoでDBから既存のデータを取得させる
					setWasLoggedOut(true);
					setIsNewSession(true);
				}
			} else if (isLoaded && !user) {
				// ユーザーがログアウトしている場合はセッションIDを削除
				localStorage.removeItem(SESSION_ID_KEY);
				// ログアウト時にZennユーザー名をクリア（UIのみ）
				setZennUsername("");
				// ログアウト時に必ずフラグを設定
				localStorage.setItem(LOGOUT_FLAG_KEY, "true");
			}
		}
	}, [
		user,
		isLoaded,
		setWasLoggedOut,
		setIsNewSession,
		setUserInfo,
		setZennUsername,
	]);
};
