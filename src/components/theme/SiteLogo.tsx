import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { BaseComponentProps } from "./ComponentProps";

interface LogoProps extends BaseComponentProps {
	href?: string;
	wrapperStyle?: React.CSSProperties;
}

const SiteLogo = (props?: LogoProps) => {
	return (
		<>
			{props?.href ? (
				<Link className={props?.className} href={props?.href} style={props?.wrapperStyle}>
					<Image
						src="/images/topranking-logo.svg"
						alt="topranking ai logo"
						width={240}
						height={40}
						// style={{ height: "100%", width: "auto", display: "inline-block" }}
					/>
				</Link>
			) : (
				<div className={props?.className} style={props?.wrapperStyle}>
					<Image
						src="/images/topranking-logo.svg"
						alt="topranking ai logo"
						width={240}
						height={40}
						// style={{ height: "100%", width: "auto", display: "inline-block" }}
					/>
				</div>
			)}
		</>
	);
};

export default SiteLogo;
