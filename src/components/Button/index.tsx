import React,{useState} from 'react';
import styles from './index.module.less';
const Button = ()=>{
    const [count,setCount] = useState(0);
    return <div>
        <div>{count}</div>
        <button className={styles.btn} onClick={()=>setCount(count+1)}>这是一个按钮</button>
    </div>
}

export default Button
