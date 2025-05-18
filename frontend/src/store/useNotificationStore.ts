import { create } from 'zustand';

export interface NotificationState {
	hasUnread: boolean;
	setHasUnread: (value: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
	hasUnread: false,
	setHasUnread: (value: boolean) => set({ hasUnread: value }),
}));
