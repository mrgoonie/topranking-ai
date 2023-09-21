import type { ReactElement, ReactNode } from "react";

export interface BaseComponentProps {
	children?: ReactNode | ReactElement;
	className?: string;
	style?: React.CSSProperties;
}
