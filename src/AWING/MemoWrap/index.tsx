import { memo } from 'react';
import { isEqual } from 'lodash';
import { MemoWrapProps } from './interface';

const checkIsEqual = (prevProps: any, nextProps: any) => {
    return prevProps.check !== undefined && isEqual(prevProps.check, nextProps.check);
};

export const MemoWrap = memo((props: MemoWrapProps) => <div>{props.children}</div>, checkIsEqual);
export default MemoWrap;
export * from './interface';
