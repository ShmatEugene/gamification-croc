import { InputNumber, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { FC, MutableRefObject } from 'react';
import useFocus from '../../../hooks/useFocus';

import './DiscountTags.scss';

type Props = {
	tags: Array<number>;
	setTags(tags: Array<number>): void;
	prefix?: string;
	suffix?: string;
	addLabel?: string;
};

const DiscountTags: FC<Props> = ({
	tags,
	setTags,
	prefix = '',
	suffix = ' %',
	addLabel = 'Добавить',
}) => {
	const [inputVisible, setInputVisible] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('');
	const [inputTagRef, setInputTagFocus] = useFocus();

	const handleClose = (removedTag): void => {
		setTags(tags.filter(tag => tag !== removedTag));
	};

	const handleInputChange = (number: string) => {
		setInputValue(number);
	};

	const handleInputConfirm = (): void => {
		if (inputValue && tags.indexOf(+inputValue) === -1) {
			setTags([...tags, +inputValue].sort((a, b) => a - b));
		} else if (tags.indexOf(+inputValue) !== -1) {
			message.error('Такой тег уже есть');
		}
		setInputVisible(false);
		setInputValue('');
	};

	const showInput = (): void => {
		setInputVisible(true);
	};

	React.useEffect(() => {
		setInputTagFocus();
	}, [inputVisible]);

	return (
		<div className='discout-tags'>
			<div>
				{tags.map((tag, index) => {
					const tagElem = (
						<Tag className='edit-tag' key={tag} closable={true} onClose={() => handleClose(tag)}>
							<span>{prefix + tag + suffix}</span>
						</Tag>
					);
					return tagElem;
				})}
			</div>
			<div>
				{inputVisible && (
					<InputNumber
						ref={inputTagRef}
						type='text'
						size='small'
						className='tag-input'
						value={inputValue}
						onChange={handleInputChange}
						onBlur={handleInputConfirm}
						onPressEnter={handleInputConfirm}
					/>
				)}

				{!inputVisible && (
					<Tag className='site-tag-plus' onClick={showInput}>
						<PlusOutlined /> {addLabel}
					</Tag>
				)}
			</div>
		</div>
	);
};

export default DiscountTags;
