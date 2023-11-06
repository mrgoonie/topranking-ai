import MasterPageAuth from "@/components/layouts/MasterPageAuth";
import UISubmit from "@/components/router/UISubmit";

export default function Submit() {
	return (
		<MasterPageAuth meta={{ title: "Submit your AI" }}>
			<UISubmit />
		</MasterPageAuth>
	);
}
