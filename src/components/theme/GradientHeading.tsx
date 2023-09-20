import type { BaseComponentProps } from "./ComponentProps";

const GradientHeading = (props?: BaseComponentProps) => {
	return <h1 className="text-gradient-green-blue">{props?.children}</h1>;
};

export default GradientHeading;
