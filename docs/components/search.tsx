
import React from 'react';
import Search from '@/components/Search';
import type { Fields } from '@/components/Search';
import {Form} from 'antd';


const HeaderForm = (props) => {
  const [form] = Form.useForm();
  const fields: Fields[] = [
    {
      label: '姓名',
      widget: 'input',
      colSpan: 1,
      widgetItemProps: {
        name: 'name',
      },
      widgetProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      label: '搜索',
      widget: 'button',
      colSpan: 1,
      widgetProps: {
        type: 'primary',
        onClick: () => {
          const value = form.getFieldsValue();
          console.log(value);
        },
      },
    },
  ];
  return <Search col={4} formProps={{ form }} fields={[...fields]} />;
};

export default HeaderForm
