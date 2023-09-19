import Link from "next/link";
import type { ReactNode } from "react";
import React, { ReactElement } from "react";

import type { BaseComponentProps } from "./ComponentProps";

export interface CategoryBtnProps extends BaseComponentProps {
	active?: boolean;
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
	leadIcon?: ReactNode;
	trailIcon?: ReactNode;
	size?: "lg" | "md" | "sm";
}

const CategoryBtn = (props?: CategoryBtnProps) => {
	const linkWrapper = (children: ReactNode) =>
		props?.href ? (
			<Link href={props.href} target={props.target}>
				{children}
			</Link>
		) : (
			children
		);

	return linkWrapper(
		<div
			className="group cursor-pointer transition-all overflow-hidden flex items-center gap-2 p-3 rounded-xl relative h-8 border-solid border  border-white border-opacity-10 hover:border-[rgba(255,_255,_255,_0.08)] hover:border-t hover:border-l-transparent hover:border-b-transparent hover:border-r-transparent"
			style={{
				background: "linear-gradient(145deg, rgb(215, 237, 237, 0.16) 0%, rgba(204, 235, 235, 0.00) 100%)",
			}}
		>
			<div className="transition-all opacity-0 group-hover:opacity-20 filter blur absolute w-10 -left-[20px] h-10 -bottom-[20px] rounded-[50%] bg-electric-green" />
			<div className="transition-all text-neutral-400 group-hover:text-green-400 text-xs font-semibold leading-[18px] tracking-tight">
				{props?.leadIcon ? (
					<>
						{props?.leadIcon}
						<span className="inline-block w-2" />
					</>
				) : null}
				{props?.children}
				{props?.trailIcon ? (
					<>
						<span className="inline-block w-2" />
						{props?.trailIcon}
					</>
				) : null}
			</div>
			<div className="transition-all opacity-0 group-hover:opacity-25 filter blur-lg absolute w-[22px] -right-[11px] h-[22px] -top-[11px] rounded-[50%] bg-electric-green" />
		</div>
	);
};

export default CategoryBtn;
