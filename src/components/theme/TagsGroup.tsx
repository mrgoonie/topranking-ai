import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";

import type { BaseComponentProps } from "./ComponentProps";

export interface TagsGroupProps extends BaseComponentProps {
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	tagInputStyle?: React.CSSProperties;
	tagPlusStyle?: React.CSSProperties;
}

const TagsGroup = (props?: TagsGroupProps) => {
	const [tags, setTags] = useState<string[]>(props?.defaultValue ?? []);
	const [inputVisible, setInputVisible] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [editInputIndex, setEditInputIndex] = useState(-1);
	const [editInputValue, setEditInputValue] = useState("");
	const inputRef = useRef<InputRef>(null);
	const editInputRef = useRef<InputRef>(null);

	useEffect(() => {
		if (inputVisible) {
			inputRef.current?.focus();
		}
	}, [inputVisible]);

	useEffect(() => {
		if (props?.onChange) props?.onChange(tags);
	}, [tags]);

	const handleClose = (removedTag: string) => {
		const newTags = tags.filter((tag) => tag !== removedTag);
		console.log(newTags);
		setTags(newTags);
	};

	const showInput = () => {
		setInputVisible(true);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleInputConfirm = () => {
		if (inputValue && !tags.includes(inputValue)) {
			setTags([...tags, inputValue]);
		}
		setInputVisible(false);
		setInputValue("");
	};

	const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditInputValue(e.target.value);
	};

	const handleEditInputConfirm = () => {
		const newTags = [...tags];
		newTags[editInputIndex] = editInputValue;
		setTags(newTags);
		setEditInputIndex(-1);
		setEditInputValue("");
	};

	return (
		<div className={props?.className}>
			{tags.map((keyword: any) => (
				<Tag key={keyword} closable>
					{keyword}
				</Tag>
			))}
			{inputVisible ? (
				<Input
					ref={inputRef}
					type="text"
					size="small"
					style={props?.tagInputStyle}
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleInputConfirm}
					onPressEnter={handleInputConfirm}
				/>
			) : (
				<Tag style={props?.tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
					New Tag
				</Tag>
			)}
		</div>
	);
};

export default TagsGroup;
