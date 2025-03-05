import React,{ ReactNode } from "react"
import styles from './index.module.less'
export interface TextProps{
    text:string|ReactNode
}
const Text = (props:TextProps)=>{
    const {text}=props;
     console.log(1)
    return <div className={styles.text}>{text}</div>
}

export default Text