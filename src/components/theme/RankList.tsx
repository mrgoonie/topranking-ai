import type { BaseComponentProps } from "./ComponentProps";
import type { RankItemProps } from "./RankItem";
import RankItem from "./RankItem";

export interface RankListDataItem extends RankItemProps {}

interface RankListProps extends BaseComponentProps {
	dataSource?: RankListDataItem[];
	renderItem?: (item: RankListDataItem, index: number) => any;
}

const RankList = (props?: RankListProps) => {
	return (
		<div className={`flex w-full flex-col gap-5 ${props?.className ?? ""}`} style={props?.style}>
			{props?.dataSource?.map((item, i) => <RankItem key={`rank-item-${item.rank ?? i}`} {...item} />)}
		</div>
	);
};

export default RankList;
