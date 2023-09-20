import type { BaseComponentProps } from "./ComponentProps";

interface HashtagProps extends BaseComponentProps {}

const Hashtag = (props?: HashtagProps) => {
	return (
		<span className="text-xs font-normal leading-[18px] tracking-tight text-indigo-300">
			{props?.children ?? "#hashtag"}
		</span>
	);
};

export default Hashtag;
