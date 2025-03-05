
import React from 'react';
import styles from './index.module.less'
export interface ListProps {
    data:{label:string,val:string|number,key:string}[]
}
const List = (props:ListProps)=>{
    const {data} = props;
    return <ul className={styles.list}>
        {
            data.map(item=>{
                return <li key={item.key}>{item.label + ':' + item.val}</li>
            })
        }
    </ul>
}

export default List