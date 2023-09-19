import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
	href?: string;
	wrapperStyle?: React.CSSProperties;
}

const SiteLogo = (props?: LogoProps) => {
	return (
		<>
			{props?.href ? (
				<Link href={props?.href} style={props?.wrapperStyle}>
					<Image
						src="/images/topranking-logo.svg"
						alt="topranking ai logo"
						width={240}
						height={40}
						style={{ height: "100%", width: "auto", display: "inline-block", maxWidth: "unset" }}
					/>
				</Link>
			) : (
				<span style={props?.wrapperStyle}>
					<Image
						src="/images/topranking-logo.svg"
						alt="topranking ai logo"
						width={240}
						height={40}
						style={{ height: "100%", width: "auto", display: "inline-block", maxWidth: "unset" }}
					/>
				</span>
			)}
		</>
	);
};

export default SiteLogo;
