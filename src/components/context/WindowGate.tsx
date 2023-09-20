import { isMobile } from "diginext-utils/dist/device";
import { toBool } from "diginext-utils/dist/object";
import dynamic from "next/dynamic";
import { createContext, memo, useEffect, useMemo, useState } from "react";

import { useListener } from "@/components/context/ListenerProvider";
import asset from "@/plugins/asset";

const QrUrl = dynamic(() => import("@/components/qr/QrUrl"), { ssr: false });

type ISize = { width: number; height: number };

export const WindowGateContext = createContext<null>(null);

const WindowGateProvider = ({ children, ...props }: any) => {
	//

	const [size, setSize] = useState<ISize>({ width: 0, height: 0 });
	const [canAccess, setCanAccess] = useState(true);

	const listener = useListener();

	const onListen = (e: any) => {
		const { type, data } = e;
		switch (type) {
			case "window-resize":
				{
					const { width, height } = data;
					setSize({ width, height });
				}
				break;

			default:
				break;
		}
	};

	if (listener) {
		listener.useSubscription((e: any) => {
			onListen(e);
		});
	}

	const gate = useMemo(() => {
		const { width, height } = size;

		switch (true) {
			case width > height && isMobile():
				return (
					<div className="holderGate">
						<h2 className="gateText">Vui lòng xoay dọc màn hình để trải nghiệm.</h2>
					</div>
				);

			case !isMobile(): {
				return (
					<div className="holderGate">
						<style jsx>{`
							.gateText {
								text-align: -webkit-center;
							}
						`}</style>

						<div className="hol gateText">
							<h2 className="text-3xl">
								Vui lòng truy cập trên thiết bị di động để có trải nghiệm tốt nhất.
							</h2>
							<QrUrl />
						</div>

						<img
							className="non-drag fixed m-6 w-1/3 max-w-[150px]"
							src={asset("/images-webp/textures/game/logo.webp")}
							alt=""
						/>
					</div>
				);
			}

			default:
				return <></>;
		}
	}, [canAccess, JSON.stringify(size)]);

	useEffect(() => {
		//init once
		if (typeof window == "undefined") return;

		const onResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			listener.emit({
				type: "window-resize",
				data: {
					width,
					height,
				},
			});
		};

		onResize();

		window.addEventListener("orientationchange", onResize);
		window.addEventListener("resize", onResize);
		return () => {
			//
			window.removeEventListener("orientationchange", onResize);
			window.removeEventListener("resize", onResize);
		};
	}, []);

	useEffect(() => {
		const { width, height } = size;
		setCanAccess(
			toBool(
				// IsLocal() ||
				(width < height && isMobile()) as any
			)
		);

		return () => {};
	}, [JSON.stringify(size)]);

	return (
		<WindowGateContext.Provider value={{}} {...props}>
			{canAccess ? <> {children}</> : <>{gate}</>}
		</WindowGateContext.Provider>
	);
};

export default memo(WindowGateProvider);
