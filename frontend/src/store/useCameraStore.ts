import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CameraState {
	camera: {
		isScan: boolean;
		taskId: string;
	};
	setCamera: (camera: CameraState['camera']) => void;
}

export const useCameraStore = create<CameraState>()(
	persist(
		(set) => ({
			camera: {
				isScan: false,
				taskId: '',
			},

			setCamera: (camera: CameraState['camera']) => set({ camera }),
		}),

		{
			name: 'camera-storage',
		},
	),
);
